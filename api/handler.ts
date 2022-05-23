import { VercelResponse } from "@vercel/node";
import { InteractionType } from "discord-interactions";

export default (body, response: VercelResponse) => {
    switch (body.type) {
        case InteractionType.MESSAGE_COMPONENT:
            if (body.data.custom_id === "pronouns") {
                response.send({
                    type: InteractionType.MESSAGE_COMPONENT,
                    data: {
                        "content": "Mason is looking for new arena partners. What classes do you play?",
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    {
                                        "type": 3,
                                        "custom_id": "he_him",
                                        "options": [
                                            {
                                                "label": "He / Him",
                                                "value": "he_him",
                                                "description": "Add He / Him to your pronouns",
                                                "emoji": {
                                                    "name": "hehim",
                                                    "id": "977171648941817946"
                                                }
                                            },
                                            {
                                                "label": "She / Her",
                                                "value": "she_her",
                                                "description": "Add She / Her to your pronouns",
                                                "emoji": {
                                                    "name": "sheher",
                                                    "id": "977171648748859392"
                                                }
                                            },
                                            {
                                                "label": "They / Them",
                                                "value": "they_them",
                                                "description": "Add They / Them to your pronouns",
                                                "emoji": {
                                                    "name": "theythem",
                                                    "id": "977171648492998699"
                                                }
                                            },
                                            {
                                                "label": "Ask Pronouns",
                                                "value": "ask",
                                                "description": "Add Ask Pronouns to your pronouns",
                                                "emoji": {
                                                    "name": "ask",
                                                    "id": "977271207021924402"
                                                }
                                            },
                                            {
                                                "label": "Any Pronouns",
                                                "value": "any",
                                                "description": "Add Any Pronouns to your pronouns",
                                                "emoji": {
                                                    "name": "any",
                                                    "id": "977271206971596841"
                                                }
                                            }
                                        ],
                                        "placeholder": "Choose your pronouns",
                                        "min_values": 1
                                    }
                                ]
                            }
                        ]
                    }
                })
            }
            break
    }
}