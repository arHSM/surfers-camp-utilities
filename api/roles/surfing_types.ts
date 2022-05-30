export const surfingTypesDropdown = {
    content: `Alright! Select your **Surfing Types**
> *Tip: choose **Pronouns** next!*`,
    flags: 64,
    components: [
        {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: 'surfing_types_dropdown',
                    options: [
                        {
                            label: 'Longboard',
                            value: 'longboard',
                            description:
                                'Add Longboard to your surfing types',
                            emoji: {
                                name: 'Longboard',
                                id: '980786936413298688',
                            },
                        },
                        {
                            label: 'Shortboard',
                            value: 'shortboard',
                            description:
                                'Add Shortboard to your surfing types',
                            emoji: {
                                name: 'Shortboard',
                                id: '980786936597852180',
                            },
                        },
                        {
                            label: 'Skimboard',
                            value: 'skimboard',
                            description:
                                'Add Skimboard to your surfing types',
                            emoji: {
                                name: 'Skimboard',
                                id: '980786936555900948',
                            },
                        },
                        {
                            label: 'Wakeboard',
                            value: 'wakeboard',
                            description:
                                'Add Wakeboard to your surfing types',
                            emoji: {
                                name: 'Wakeboard',
                                id: '980786936987930664',
                            },
                        },
                        {
                            label: 'Kiteboard',
                            value: 'kiteboard',
                            description:
                                'Add Kiteboard to your surfing types',
                            emoji: {
                                name: 'Kiteboard',
                                id: '980786935494742026',
                            },
                        },
                        {
                            label: 'Windboard',
                            value: 'windboard',
                            description:
                                'Add Windboard to your surfing types',
                            emoji: {
                                name: 'Windboard',
                                id: '980786936887255040',
                            },
                        },
                    ],
                    placeholder: 'Choose your surfing types',
                    min_values: 1,
                    max_values: 6,
                },
            ],
        },
    ],
}

export const surfingTypesRoleMap = {
    longboard: process.env.LONGBOARD,
    shortboard: process.env.SHORTBOARD,
    skimboard: process.env.SKIMBOARD,
    wakeboard: process.env.WAKEBOARD,
    kiteboard: process.env.KITEBOARD,
    windboard: process.env.WINDBOARD,
}

export const surfingTypesMessage = (
    added: Array<string>,
    removed: Array<string>,
): string => {
    return `${added.length > 0
        ? `Added ${added
            .map((pronoun) => `<@&${pronoun}>`)
            .join(', ')} to your surfing types.`
        : ''
        }${removed.length > 0
            ? `\nRemoved ${removed
                .map((pronoun) => `<@&${pronoun}>`)
                .join(', ')} from your surfing types.`
            : ''
        }`
}
