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
    data: [Array<string>, Array<string>, any, any, string],
) {
    let base = data[0]
    let roles = data[1]
    let map = data[2]
    let message = data[3]

    base = base.map((role) => map[role])

    console.log(`Member ${user} has roles: ${roles.join()}`)
    console.log(`Roles to work with: ${base.join()}`)
    console.log(`Roles Map: ${JSON.stringify(map)}`)

    let existing = []
    let to_remove = []

    for (const role of roles) {
        if (
            base.includes(role) ||
            (data[4] === 'proficiency_dropdown' &&
                Object.values(map).includes(role))
        ) {
            to_remove.push(role)
        } else {
            existing.push(role)
        }
    }

    base = base.filter((role) => !to_remove.includes(role))
    roles = existing.concat(base)

    console.log(`Patching roles [${roles}] for ${user}`)

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

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/**
 * Surfers Camp Utilities
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

                        // apparently the previous state persists for some
                        // reason in vercel and because of that instead of
                        // responding with a new message, it just edits
                        // the main message, which is not good :/
                        rolesPrompt.type = 4
                        rolesPrompt.data.components[0].components[0].style = 1
                        rolesPrompt.data.components[0].components[1].style = 2
                        rolesPrompt.data.components[0].components[2].style = 2

                        return response.status(200).send(rolesPrompt)
                    case 'proficiency':
                        console.log('Sending proficiency dropdown')

                        // Edit buttons
                        rolesPrompt.type = 7
                        rolesPrompt.data.components[0].components[0].style = 2
                        rolesPrompt.data.components[0].components[1].style = 1

                        // Send dropdown
                        fetch(
                            `https://surfers-camp-utilities-arhsm.vercel.app/api/followup`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    token: message.token,
                                    body: proficiencyDropdown
                                }),
                            },
                        )

                        await sleep(50)

                        return response.status(200).send(rolesPrompt)
                    case 'surfing_types':
                        console.log('Sending surfing type dropdown')

                        // Edit buttons
                        rolesPrompt.type = 7
                        rolesPrompt.data.components[0].components[0].style = 2
                        rolesPrompt.data.components[0].components[1].style = 2
                        rolesPrompt.data.components[0].components[2].style = 1

                        // Send dropdown
                        fetch(
                            `https://surfers-camp-utilities-arhsm.vercel.app/api/followup`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    token: message.token,
                                    body: surfingTypesDropdown
                                }),
                            },
                        )

                        await sleep(50)

                        return response.status(200).send(rolesPrompt)
                    case 'pronouns':
                        console.log('Sending pronouns dropdown')

                        // Edit buttons
                        rolesPrompt.type = 7
                        rolesPrompt.data.components[0].components[0].style = 3
                        rolesPrompt.data.components[0].components[1].style = 3
                        rolesPrompt.data.components[0].components[2].style = 3

                        // Send dropdown
                        fetch(
                            `https://surfers-camp-utilities-arhsm.vercel.app/api/followup`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    token: message.token,
                                    body: pronounsDropdown
                                }),
                            },
                        )

                        await sleep(50)

                        return response.status(200).send(rolesPrompt)
                }
            } else if (message.data.component_type === 3) {
                switch (message.data.custom_id) {
                    case 'proficiency_dropdown':
                        console.log(`Setting ${message.member.user.id}'s proficiency`)
                        return response
                            .status(200)
                            .send(
                                await modifyRoles(message.member.user.id, [
                                    message.data.values,
                                    message.member.roles,
                                    proficiencyRoleMap,
                                    proficiencyMessage,
                                    'proficiency_dropdown',
                                ]),
                            )
                    case 'surfing_types_dropdown':
                        console.log(`Adding/Removing ${message.member.user.id}'s surfing types`)
                        return response
                            .status(200)
                            .send(
                                await modifyRoles(message.member.user.id, [
                                    message.data.values,
                                    message.member.roles,
                                    surfingTypesRoleMap,
                                    surfingTypesMessage,
                                    'surfing_types_dropdown',
                                ]),
                            )
                    case 'pronoun_dropdown':
                        console.log(`Adding/Removing ${message.member.user.id}'s pronouns`)
                        return response
                            .status(200)
                            .send(
                                await modifyRoles(message.member.user.id, [
                                    message.data.values,
                                    message.member.roles,
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
