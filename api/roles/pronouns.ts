export const pronounsDropdown = {
    content: `Alright! Select your pronouns
> *Tip: You're done! go ahead and introduce yourself in <#${process.env.INTRODUCTION_CHANNEL}>*`,
    flags: 64,
    components: [
        {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: 'pronoun_dropdown',
                    options: [
                        {
                            label: 'He / Him',
                            value: 'he_him',
                            description: 'Add He / Him to your pronouns',
                            emoji: {
                                name: 'hehim',
                                id: '977171648941817946',
                            },
                        },
                        {
                            label: 'She / Her',
                            value: 'she_her',
                            description: 'Add She / Her to your pronouns',
                            emoji: {
                                name: 'sheher',
                                id: '977171648748859392',
                            },
                        },
                        {
                            label: 'They / Them',
                            value: 'they_them',
                            description: 'Add They / Them to your pronouns',
                            emoji: {
                                name: 'theythem',
                                id: '977171648492998699',
                            },
                        },
                        {
                            label: 'Ask Pronouns',
                            value: 'ask',
                            description:
                                'Add Ask Pronouns to your pronouns',
                            emoji: {
                                name: 'ask',
                                id: '977271207021924402',
                            },
                        },
                        {
                            label: 'Any Pronouns',
                            value: 'any',
                            description:
                                'Add Any Pronouns to your pronouns',
                            emoji: {
                                name: 'any',
                                id: '977271206971596841',
                            },
                        },
                    ],
                    placeholder: 'Choose your pronouns',
                    min_values: 1,
                    max_values: 5,
                },
            ],
        },
    ],
}

export const pronounRoleMap = {
    he_him: process.env.HE_HIM,
    she_her: process.env.SHE_HER,
    they_them: process.env.THEY_THEM,
    ask: process.env.ASK,
    any: process.env.ANY,
}

export const pronounMessage = (
    added: Array<string>,
    removed: Array<string>,
): string => {
    return `${added.length > 0
        ? `Added ${added
            .map((pronoun) => `<@&${pronoun}>`)
            .join(', ')} to your pronouns.`
        : ''
        }${removed.length > 0
            ? `\nRemoved ${removed
                .map((pronoun) => `<@&${pronoun}>`)
                .join(', ')} from your pronouns.`
            : ''
        }`
}
