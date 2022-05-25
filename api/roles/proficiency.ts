export const proficiencyDropdown = {
    type: 4,
    data: {
        content: `Alright! Select your proficiency
> *Tip: Select & Submit again to remove them,*\n> *choose **Surfing Types** next!*`,
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
                            },
                            {
                                label: 'Intermediate',
                                value: 'intermediate',
                                description:
                                    'Set Intermediate as your proficiency',
                            },
                            {
                                label: 'Expert',
                                value: 'expert',
                                description: 'Set Expert as your proficiency',
                            },
                        ],
                        placeholder: 'Choose your proficiency',
                        min_values: 1,
                    },
                ],
            },
        ],
    },
}

export const proficiencyRoleMap = {
    beginner: process.env.BEGINNER,
    intermediate: process.env.INTERMEDIATE,
    expert: process.env.EXPERT,
}

export const proficiencyMessage = (added: [string], removed: []): string => {
    return `Your proficiency is now set to <@&${added[0]}>.`
}
