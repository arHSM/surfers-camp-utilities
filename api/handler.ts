import { InteractionType } from "discord-interactions";
import fetch from "cross-fetch";

const rolesPrompt = {
    type: 4,
    data: {
        content: `Pick your proficiency in order to access the community.
Pick surfing types and pronouns to let the community know more about you!`,
        flags: 64,
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 3,
                        label: "Proficiency",
                        custom_id: "proficiency",
                    },
                    {
                        type: 2,
                        style: 2,
                        label: "Surfing Types",
                        custom_id: "surfing_types",
                    },
                    {
                        type: 2,
                        style: 2,
                        label: "Pronouns",
                        custom_id: "pronouns",
                    },
                ]
            }
        ]
    }
}

const pronounsDropdown = {
    type: 4,
    data: {
        content: `Alright! Select your pronouns
*Tip: Select & Submit again to remove them*`,
        flags: 64,
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 3,
                        custom_id: "pronoun_dropdown",
                        options: [
                            {
                                label: "He / Him",
                                value: "he_him",
                                description: "Add He / Him to your pronouns",
                                emoji: {
                                    name: "hehim",
                                    id: "977171648941817946"
                                }
                            },
                            {
                                label: "She / Her",
                                value: "she_her",
                                description: "Add She / Her to your pronouns",
                                emoji: {
                                    name: "sheher",
                                    id: "977171648748859392"
                                }
                            },
                            {
                                label: "They / Them",
                                value: "they_them",
                                description: "Add They / Them to your pronouns",
                                emoji: {
                                    name: "theythem",
                                    id: "977171648492998699"
                                }
                            },
                            {
                                label: "Ask Pronouns",
                                value: "ask",
                                description: "Add Ask Pronouns to your pronouns",
                                emoji: {
                                    name: "ask",
                                    id: "977271207021924402"
                                }
                            },
                            {
                                label: "Any Pronouns",
                                value: "any",
                                description: "Add Any Pronouns to your pronouns",
                                emoji: {
                                    name: "any",
                                    id: "977271206971596841"
                                }
                            }
                        ],
                        placeholder: "Choose your pronouns",
                        min_values: 1,
                        max_values: 5,
                    }
                ]
            }
        ]
    }
}

const surfingTypesDropdown = {
    type: 4,
    data: {
        content: `Alright! Select your surfing types
*Tip: Select & Submit again to remove them*`,
        flags: 64,
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 3,
                        custom_id: "surfing_types_dropdown",
                        options: [
                            {
                                label: "Longboard",
                                value: "longboard",
                                description: "Add Longboard to your surfing types",
                            },
                            {
                                label: "Shortboard",
                                value: "shortboard",
                                description: "Add Shortboard to your surfing types",
                            },
                            {
                                label: "Skimboard",
                                value: "skimboard",
                                description: "Add Skimboard to your surfing types",
                            },
                            {
                                label: "Wakeboard",
                                value: "wakeboard",
                                description: "Add Wakeboard to your surfing types",
                            },
                            {
                                label: "Kiteboard",
                                value: "kiteboard",
                                description: "Add Kiteboard to your surfing types",
                            },
                            {
                                label: "Windboard",
                                value: "windboard",
                                description: "Add Windboard to your surfing types",
                            },
                        ],
                        placeholder: "Choose your surfing types",
                        min_values: 1,
                        max_values: 6,
                    }
                ]
            }
        ]
    }
}

const proficiencyDropdown = {
    type: 4,
    data: {
        content: `Alright! Select your proficiency
*Tip: Select & Submit again to remove them*`,
        flags: 64,
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 3,
                        custom_id: "proficiency_dropdown",
                        options: [
                            {
                                label: "Beginner",
                                value: "beginner",
                                description: "Set Beginner as your proficiency",
                            },
                            {
                                label: "Intermediate",
                                value: "intermediate",
                                description: "Set Intermediate as your proficiency",
                            },
                            {
                                label: "Expert",
                                value: "expert",
                                description: "Set Expert as your proficiency",
                            },
                        ],
                        placeholder: "Choose your proficiency",
                        min_values: 1,
                    }
                ]
            }
        ]
    }
}

const pronounRoleMap = {
    he_him: process.env.HE_HIM,
    she_her: process.env.SHE_HER,
    they_them: process.env.THEY_THEM,
    ask: process.env.ASK,
    any: process.env.ANY,
}

const pronounMessage = (added: Array<string>, removed: Array<string>): string => {
    return `${added.length > 0 ? `Added ${added.map(pronoun => `<@&${pronoun}>`).join(", ")} to your pronouns.` : ""}${removed.length > 0 ? `\nRemoved ${removed.map(pronoun => `<@&${pronoun}>`).join(", ")} from your pronouns.` : ""}`
}

const proficiencyRoleMap = {
    beginner: process.env.BEGINNER,
    intermediate: process.env.INTERMEDIATE,
    expert: process.env.EXPERT,
}

const proficiencyMessage = (added: [string], removed: []): string => {
    return `Your proficiency is now set to <@&${added[0]}>.`
}

const surfingTypesRoleMap = {
    longboard: process.env.LONGBOARD,
    shortboard: process.env.SHORTBOARD,
    skimboard: process.env.SKIMBOARD,
    wakeboard: process.env.WAKEBOARD,
    kiteboard: process.env.KITEBOARD,
    windboard: process.env.WINDBOARD,
}

const surfingTypesMessage = (added: Array<string>, removed: Array<string>): string => {
    return `${added.length > 0 ? `Added ${added.map(pronoun => `<@&${pronoun}>`).join(", ")} to your surfing types.` : ""}${removed.length > 0 ? `\nRemoved ${removed.map(pronoun => `<@&${pronoun}>`).join(", ")} from your surfing types.` : ""}`
}


async function modifyRoles(user: string, proficiency?: Array<string>, surfingTypes?: Array<string>, pronouns?: Array<string>) {
    let base: Array<string>;
    let map: any;
    let message;

    if (typeof proficiency !== "undefined") {
        base = proficiency;
        map = proficiencyRoleMap;
        message = proficiencyMessage;
    } else if (typeof surfingTypes !== "undefined") {
        base = surfingTypes;
        map = surfingTypesRoleMap;
        message = surfingTypesMessage;
    } else if (typeof pronouns !== "undefined") {
        base = pronouns;
        map = pronounRoleMap;
        message = pronounMessage;
    }

    base = base.map(role => map[role])

    console.log(`Roles to work with: ${base.join()}`)
    console.log(`Roles Map: ${JSON.stringify(map)}`)

    let existing = [];
    let to_remove = [];

    let member = await (await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user}`, {
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
        }
    })).json()

    for (const role of member.roles) {
        if (base.includes(role) || (typeof proficiency !== "undefined" && Object.values(map).includes(role))) {
            to_remove.push(role)
        } else {
            existing.push(role)
        }
    }

    base = base.filter(role => !to_remove.includes(role));
    let roles = existing.concat(base);

    console.log(`Patching roles (${roles}) for ${user}`)

    await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
        body: JSON.stringify({
            roles
        })
    })


    return {
        type: 4,
        data: {
            content: message(base, to_remove),
            flags: 64,
            allowed_mentions: {
                parse: []
            }
        }
    }
}

export default async (body: any) => {
    if (body.type === InteractionType.MESSAGE_COMPONENT) {
        switch (body.data.component_type) {
            case 2:
                if (body.data.custom_id === "get_roles") {
                    console.log("Sending roles prompt")
                    return rolesPrompt;
                } else if (body.data.custom_id === "pronouns") {
                    console.log("Sending pronouns dropdown");
                    return pronounsDropdown;
                } else if (body.data.custom_id === "surfing_types") {
                    console.log("Sending surfing type dropdown");
                    return surfingTypesDropdown;
                } else if (body.data.custom_id === "proficiency") {
                    console.log("Sending proficiency dropdown");
                    return proficiencyDropdown;
                }
                break
            case 3:
                if (body.data.custom_id === "proficiency_dropdown") {
                    console.log("Switching proficiency")
                    return await modifyRoles(body.member.user.id, body.data.values);
                } else if (body.data.custom_id === "surfing_types_dropdown") {
                    console.log("Adding/Removing surfing types")
                    return await modifyRoles(body.member.user.id, undefined, body.data.values);
                } else if (body.data.custom_id === "pronoun_dropdown") {
                    console.log("Adding/Removing pronouns")
                    return await modifyRoles(body.member.user.id, undefined, undefined, body.data.values);
                }
                break
        }
    }
}
