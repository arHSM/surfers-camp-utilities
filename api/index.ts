import {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} from 'discord-interactions'
import getRawBody from 'raw-body'
import fetch from 'cross-fetch'
import { VercelRequest, VercelResponse } from '@vercel/node'
import {
    proficiencyDropdown,
    proficiencyRoleMap,
    proficiencyMessage,
} from './roles/proficiency'
import {
    surfingTypesDropdown,
    surfingTypesRoleMap,
    surfingTypesMessage,
} from './roles/surfing_types'
import {
    pronounsDropdown,
    pronounRoleMap,
    pronounMessage,
} from './roles/pronouns'

let rolesPrompt = {
    type: 4,
    data: {
        content: `Pick your **Proficiency** in order to access the community.
Pick surfing types and pronouns to let the community know more about you!`,
        flags: 64,
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 1,
                        label: 'Proficiency',
                        custom_id: 'proficiency',
                    },
                    {
                        type: 2,
                        style: 2,
                        label: 'Surfing Types',
                        custom_id: 'surfing_types',
                    },
                    {
                        type: 2,
                        style: 2,
                        label: 'Pronouns',
                        custom_id: 'pronouns',
                    },
                ],
            },
        ],
    },
}

async function modifyRoles(
    user: string,
    data: [Array<string>, any, any, string],
) {
    let base = data[0]
    let map = data[1]
    let message = data[2]

    base = base.map((role) => map[role])

    console.log(`Roles to work with: ${base.join()}`)
    console.log(`Roles Map: ${JSON.stringify(map)}`)

    let existing = []
    let to_remove = []

    let member = await (
        await fetch(
            `https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user}`,
            {
                headers: {
                    Authorization: `Bot ${process.env.BOT_TOKEN}`,
                },
            },
        )
    ).json()

    for (const role of member.roles) {
        if (
            base.includes(role) ||
            (data[3] === 'pronoun_dropdown' &&
                Object.values(map).includes(role))
        ) {
            to_remove.push(role)
        } else {
            existing.push(role)
        }
    }

    base = base.filter((role) => !to_remove.includes(role))
    let roles = existing.concat(base)

    console.log(`Patching roles (${roles}) for ${user}`)

    await fetch(
        `https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bot ${process.env.BOT_TOKEN}`,
            },
            body: JSON.stringify({
                roles,
            }),
        },
    )

    return {
        type: 4,
        data: {
            content: message(base, to_remove),
            flags: 64,
            allowed_mentions: {
                parse: [],
            },
        },
    }
}

/**
 * Surfers Camp Utilities
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
export default async (request: VercelRequest, response: VercelResponse) => {
    if (request.method === 'POST') {
        const signature = request.headers['x-signature-ed25519'] as string
        const timestamp = request.headers['x-signature-timestamp'] as string
        const rawBody = await getRawBody(request)

        const isValidRequest = verifyKey(
            rawBody,
            signature,
            timestamp,
            process.env.PUBLIC_KEY,
        )

        if (!isValidRequest) {
            console.error('Invalid Request')
            return response
                .status(401)
                .send({ error: 'Bad request signature ' })
        }

        const message = request.body

        if (message.type === InteractionType.PING) {
            console.log('Handling Ping request')
            return response.status(200).send({
                type: InteractionResponseType.PONG,
            })
        } else if (message.type === InteractionType.MESSAGE_COMPONENT) {
            if (message.data.component_type === 2) {
                switch (message.data.custom_id) {
                    case 'get_roles':
                        console.log('Sending roles prompt')
                        return response.status(200).send(rolesPrompt)
                    case 'proficiency':
                        console.log('Sending proficiency dropdown')

                        // Edit buttons
                        rolesPrompt.type = 7
                        rolesPrompt.data.components[0].components[0].style = 2
                        rolesPrompt.data.components[0].components[1].style = 1
                        response.status(200).send(rolesPrompt)

                        // Send dropdown
                        return await fetch(
                            `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${message.token}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bot ${process.env.BOT_TOKEN}`,
                                },
                                body: JSON.stringify(proficiencyDropdown),
                            },
                        )
                    case 'surfing_types':
                        console.log('Sending surfing type dropdown')

                        // Edit buttons
                        rolesPrompt.type = 7
                        rolesPrompt.data.components[0].components[1].style = 2
                        rolesPrompt.data.components[0].components[2].style = 1
                        response.status(200).send(rolesPrompt)

                        // Send dropdown
                        return await fetch(
                            `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${message.token}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bot ${process.env.BOT_TOKEN}`,
                                },
                                body: JSON.stringify(surfingTypesDropdown),
                            },
                        )
                    case 'pronouns':
                        console.log('Sending pronouns dropdown')

                        // Edit buttons
                        rolesPrompt.type = 7
                        rolesPrompt.data.components[0].components[0].style = 1
                        rolesPrompt.data.components[0].components[1].style = 1
                        response.status(200).send(rolesPrompt)

                        // Send dropdown
                        return await fetch(
                            `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${message.token}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bot ${process.env.BOT_TOKEN}`,
                                },
                                body: JSON.stringify(pronounsDropdown),
                            },
                        )
                }
            } else if (message.data.component_type === 3) {
                switch (message.data.custom_id) {
                    case 'proficiency_dropdown':
                        return response
                            .status(200)
                            .send(
                                await modifyRoles(message.member.user_id, [
                                    message.data.values,
                                    proficiencyRoleMap,
                                    proficiencyMessage,
                                    'proficiency_dropdown',
                                ]),
                            )
                    case 'surfing_types_dropdown':
                        return response
                            .status(200)
                            .send(
                                await modifyRoles(message.member.user_id, [
                                    message.data.values,
                                    surfingTypesRoleMap,
                                    surfingTypesMessage,
                                    'surfing_types_dropdown',
                                ]),
                            )
                    case 'pronoun_dropdown':
                        return response
                            .status(200)
                            .send(
                                await modifyRoles(message.member.user_id, [
                                    message.data.values,
                                    pronounRoleMap,
                                    pronounMessage,
                                    'pronoun_dropdown',
                                ]),
                            )
                }
            }
        }
    }

    return response.status(405).send('Method not allowed')
}
