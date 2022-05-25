import { InteractionType } from "discord-interactions";
import fetch from "cross-fetch";

const pronounsDropdown = {
    type: 4,
    data: {
        content: `Select your pronouns
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


const roleMap = {
    he_him: process.env.HE_HIM,
    she_her: process.env.SHE_HER,
    they_them: process.env.THEY_THEM,
    ask: process.env.ASK,
    any: process.env.ANY,
}


async function addPronouns(user: string, pronouns: Array<string>) {
    pronouns = pronouns.map(pronoun => roleMap[pronoun])
    let existing = []
    let to_remove = []


    let member = await (await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user}`, {
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
        }
    })).json()

    for (const role of member.roles) {
        if (pronouns.includes(role)) {
            to_remove.push(role)
        } else {
            existing.push(role)
        }
    }

    pronouns = pronouns.filter(pronoun => !to_remove.includes(pronoun))

    await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${user}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
        body: JSON.stringify({
            roles: existing.concat(pronouns)
        })
    })
    return {
        type: 4,
        data: {
            content: `${pronouns.length > 0 ? `Added **${pronouns.map(pronoun => `<@&${pronoun}>`).join()}** to your pronouns.` : ""}${to_remove.length > 0 ? `\nRemoved **${to_remove.map(pronoun => `<@&${pronoun}>`).join()}** from your pronouns.` : ""}`,
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
                if (body.data.custom_id === "pronouns") {
                    console.log("Sending pronouns dropdown");
                    return pronounsDropdown;
                }
                break
            case 3:
                if (body.data.custom_id === "pronoun_dropdown") {
                    console.log("Adding/Removing pronouns")
                    return await addPronouns(body.member.user.id, body.data.values);
                }
                break
        }
    }
}
