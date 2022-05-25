export const surfingTypesDropdown = {
    type: 4,
    data: {
        content: `Alright! Select your surfing types
> *Tip: Select & Submit again to remove them*\n> *choose **Pronouns** next!*`,
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
                            },
                            {
                                label: 'Shortboard',
                                value: 'shortboard',
                                description:
                                    'Add Shortboard to your surfing types',
                            },
                            {
                                label: 'Skimboard',
                                value: 'skimboard',
                                description:
                                    'Add Skimboard to your surfing types',
                            },
                            {
                                label: 'Wakeboard',
                                value: 'wakeboard',
                                description:
                                    'Add Wakeboard to your surfing types',
                            },
                            {
                                label: 'Kiteboard',
                                value: 'kiteboard',
                                description:
                                    'Add Kiteboard to your surfing types',
                            },
                            {
                                label: 'Windboard',
                                value: 'windboard',
                                description:
                                    'Add Windboard to your surfing types',
                            },
                        ],
                        placeholder: 'Choose your surfing types',
                        min_values: 1,
                        max_values: 6,
                    },
                ],
            },
        ],
    },
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
    return `${
        added.length > 0
            ? `Added ${added
                  .map((pronoun) => `<@&${pronoun}>`)
                  .join(', ')} to your surfing types.`
            : ''
    }${
        removed.length > 0
            ? `\nRemoved ${removed
                  .map((pronoun) => `<@&${pronoun}>`)
                  .join(', ')} from your surfing types.`
            : ''
    }`
}
