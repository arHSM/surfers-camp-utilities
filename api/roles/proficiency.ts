export const proficiencyDropdown = {
    content: `Alright! Select your **Proficiency**
> *Tip: Select & Submit again to remove them. If you don't know how to surf, select **Beginner***\n> *choose **Surfing Types** next!*`,
    flags: 64,
    components: [
        {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: 'proficiency_dropdown',
                    options: [
                        {
                            label: 'Beginner',
                            value: 'beginner',
                            description: 'Set Beginner as your proficiency',
                            emoji: {
                                name: 'Beginner',
                                id: '979703570863632467',
                            },
                        },
                        {
                            label: 'Intermediate',
                            value: 'intermediate',
                            description:
                                'Set Intermediate as your proficiency',
                            emoji: {
                                name: 'Intermediate',
                                id: '979703571077533728'
                            },
                        },
                        {
                            label: 'Expert',
                            value: 'expert',
                            description: 'Set Expert as your proficiency',
                            emoji: {
                                name: 'Master',
                                id: '979703571954159666',
                            },
                        },
                    ],
                    placeholder: 'Choose your proficiency',
                    min_values: 1,
                },
            ],
        },
    ],
}

export const proficiencyRoleMap = {
    beginner: process.env.BEGINNER,
    intermediate: process.env.INTERMEDIATE,
    expert: process.env.EXPERT,
}

export const proficiencyMessage = (added: [string], removed: []): string => {
    if (typeof added[0] === "undefined") {
        return `**You have removed your proficiency!**`
    }
    return `Your proficiency is now set to <@&${added[0]}>.`
}
