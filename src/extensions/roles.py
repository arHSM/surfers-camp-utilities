from __future__ import annotations

from typing import TYPE_CHECKING
from os import getenv

from interactions import ActionRow, Button, Emoji, SelectMenu, SelectOption

if TYPE_CHECKING:
    from interactions import Client, ComponentContext


GUILD_ID = getenv("GUILD_ID", "")
INTRODUCTION_CHANNEL = getenv("INTRODUCTION_CHANNEL", "")

BEGINNER = int(getenv("BEGINNER", ""))
INTERMEDIATE = int(getenv("INTERMEDIATE", ""))
EXPERT = int(getenv("EXPERT", ""))

PROFICIENCY_MAP = {
    "beginner": BEGINNER,
    "intermediate": INTERMEDIATE,
    "expert": EXPERT,
}

BEGINNER_EMOJI = getenv("BEGINNER_EMOJI", "")
INTERMEDIATE_EMOJI = getenv("INTERMEDIATE_EMOJI", "")
EXPERT_EMOJI = getenv("EXPERT_EMOJI", "")

LONGBOARD = int(getenv("LONGBOARD", ""))
SHORTBOARD = int(getenv("SHORTBOARD", ""))
SKIMBOARD = int(getenv("SKIMBOARD", ""))
WAKEBOARD = int(getenv("WAKEBOARD", ""))
KITEBOARD = int(getenv("KITEBOARD", ""))
WINDBOARD = int(getenv("WINDBOARD", ""))

SURFING_TYPES_MAP = {
    "longboard": LONGBOARD,
    "shortboard": SHORTBOARD,
    "skimboard": SKIMBOARD,
    "wakeboard": WAKEBOARD,
    "kiteboard": KITEBOARD,
    "windboard": WINDBOARD,
}

LONGBOARD_EMOJI = getenv("LONGBOARD_EMOJI", "")
SHORTBOARD_EMOJI = getenv("SHORTBOARD_EMOJI", "")
SKIMBOARD_EMOJI = getenv("SKIMBOARD_EMOJI", "")
WAKEBOARD_EMOJI = getenv("WAKEBOARD_EMOJI", "")
KITEBOARD_EMOJI = getenv("KITEBOARD_EMOJI", "")
WINDBOARD_EMOJI = getenv("WINDBOARD_EMOJI", "")


HE_HIM = int(getenv("HE_HIM", ""))
SHE_HER = int(getenv("SHE_HER", ""))
THEY_THEM = int(getenv("THEY_THEM", ""))
ASK = int(getenv("ASK", ""))
ANY = int(getenv("ANY", ""))

PRONOUNS_MAP = {
    "he_him": HE_HIM,
    "she_her": SHE_HER,
    "they_them": THEY_THEM,
    "ask_pronouns": ASK,
    "any_pronouns": ANY,
}

HE_HIM_EMOJI = getenv("HE_HIM_EMOJI", "")
SHE_HER_EMOJI = getenv("SHE_HER_EMOJI", "")
THEY_THEM_EMOJI = getenv("THEY_THEM_EMOJI", "")
ASK_EMOJI = getenv("ASK_EMOJI", "")
ANY_EMOJI = getenv("ANY_EMOJI", "")


class Role:
    def __init__(self, client: Client):
        self.client = client

        # Main role prompt
        self.client.component("get_roles")(self.send_role_prompt)

        # Role *types*
        self.client.component("proficiency")(self.send_proficiency)
        self.client.component("surfing_types")(self.send_surfing_types)
        self.client.component("pronouns")(self.send_pronouns)

        # Edit callbacks
        self.client.component("proficiency_dropdown")(self.edit_proficiency)
        self.client.component("surfing_types_dropdown")(self.edit_surfing_types)
        self.client.component("pronouns_dropdown")(self.edit_pronouns)

    @staticmethod
    async def send_role_prompt(ctx: ComponentContext) -> None:
        await ctx.send(
            content="Pick your **Proficiency** in order to access the community.\nPick surfing types and pronouns to let the community know more about you!",
            ephemeral=True,
            components=[
                Button(style=1, label="Proficiency", custom_id="proficiency"),
                Button(style=2, label="Surfing Types", custom_id="surfing_types"),
                Button(style=2, label="Pronouns", custom_id="pronouns"),
            ],
        )

    @staticmethod
    async def send_proficiency(ctx: ComponentContext):
        await ctx.edit(
            components=[
                Button(style=2, label="Proficiency", custom_id="proficiency"),
                Button(style=1, label="Surfing Types", custom_id="surfing_types"),
                Button(style=2, label="Pronouns", custom_id="pronouns"),
            ],
        )
        await ctx.send(
            content="""Alright! Select your **Proficiency**
> *Tip: Click again to remove them. If you don't know how to surf, select **Beginner***
> *choose **Surfing Types** next!*""",
            ephemeral=True,
            components=SelectMenu(
                custom_id="proficiency_dropdown",
                options=[
                    SelectOption(
                        label="Beginner",
                        value="beginner",
                        desciption="Set Beginner as your proficiency",
                        emoji=Emoji(name="Beginner", id=BEGINNER_EMOJI),
                    ),
                    SelectOption(
                        label="Intermediate",
                        value="intermediate",
                        desciption="Set Intermediate as your proficiency",
                        emoji=Emoji(name="Intermediate", id=INTERMEDIATE_EMOJI),
                    ),
                    SelectOption(
                        label="Expert",
                        value="expert",
                        desciption="Set Expert as your proficiency",
                        emoji=Emoji(name="Master", id=EXPERT_EMOJI),
                    ),
                ],
                placeholder="Choose your proficiency",
                min_values=1,
            ),
        )

    @staticmethod
    async def send_surfing_types(ctx: ComponentContext):
        await ctx.edit(
            components=[
                Button(style=2, label="Proficiency", custom_id="proficiency"),
                Button(style=2, label="Surfing Types", custom_id="surfing_types"),
                Button(style=1, label="Pronouns", custom_id="pronouns"),
            ],
        )
        await ctx.send(
            content="""Alright! Select your **Surfing Types**
> *Tip: choose **Pronouns** next!*""",
            ephemeral=True,
            components=SelectMenu(
                custom_id="surfing_types_dropdown",
                options=[
                    SelectOption(
                        label="Longboard",
                        value="longboard",
                        desciption="Add Longboard to your surfing types",
                        emoji=Emoji(name="Longboard", id=LONGBOARD_EMOJI),
                    ),
                    SelectOption(
                        label="Shortboard",
                        value="shortboard",
                        desciption="Add Shortboard to your surfing types",
                        emoji=Emoji(name="Shortboard", id=SHORTBOARD_EMOJI),
                    ),
                    SelectOption(
                        label="Skimboard",
                        value="skimboard",
                        desciption="Add Skimboard to your surfing types",
                        emoji=Emoji(name="Skimboard", id=SKIMBOARD_EMOJI),
                    ),
                    SelectOption(
                        label="Wakeboard",
                        value="wakeboard",
                        desciption="Add Wakeboard to your surfing types",
                        emoji=Emoji(name="Wakeboard", id=WAKEBOARD_EMOJI),
                    ),
                    SelectOption(
                        label="Kiteboard",
                        value="kiteboard",
                        desciption="Add Kiteboard to your surfing types",
                        emoji=Emoji(name="Kiteboard", id=KITEBOARD_EMOJI),
                    ),
                    SelectOption(
                        label="Windboard",
                        value="windboard",
                        desciption="Add Windboard to your surfing types",
                        emoji=Emoji(name="Windboard", id=WINDBOARD_EMOJI),
                    ),
                ],
                placeholder="Choose your surfing types",
                min_values=1,
                max_values=6,
            ),
        )

    @staticmethod
    async def send_pronouns(ctx: ComponentContext):
        await ctx.edit(
            components=[
                Button(style=3, label="Proficiency", custom_id="proficiency"),
                Button(style=3, label="Surfing Types", custom_id="surfing_types"),
                Button(style=3, label="Pronouns", custom_id="pronouns"),
            ],
        )
        await ctx.send(
            content=f"""Alright! Select your **Pronouns**
> *Tip: **You're done!** go ahead and introduce yourself in <#{INTRODUCTION_CHANNEL}>*""",
            ephemeral=True,
            components=SelectMenu(
                custom_id="pronouns_dropdown",
                options=[
                    SelectOption(
                        label="He / Him",
                        value="he_him",
                        desciption="Add He / Him to your pronouns",
                        emoji=Emoji(name="HeHim", id=HE_HIM_EMOJI),
                    ),
                    SelectOption(
                        label="She / Her",
                        value="she_her",
                        desciption="Add She / Her to your pronouns",
                        emoji=Emoji(name="SheHer", id=SHE_HER_EMOJI),
                    ),
                    SelectOption(
                        label="They / Them",
                        value="they_them",
                        desciption="Add They / Them to your pronouns",
                        emoji=Emoji(name="TheyThem", id=THEY_THEM_EMOJI),
                    ),
                    SelectOption(
                        label="Ask Pronouns",
                        value="ask_pronouns",
                        desciption="Add Ask Pronouns to your pronouns",
                        emoji=Emoji(name="AskPronouns", id=ASK_EMOJI),
                    ),
                    SelectOption(
                        label="Any Pronouns",
                        value="any_pronouns",
                        desciption="Add Any Pronouns to your pronouns",
                        emoji=Emoji(name="AnyPronouns", id=ANY_EMOJI),
                    ),
                ],
                placeholder="Choose your pronouns",
                min_values=1,
                max_values=5,
            ),
        )

    @staticmethod
    async def edit_proficiency(ctx: ComponentContext, values: list[str]):
        roles = ctx.member.roles.copy()
        to_add = PROFICIENCY_MAP[values[0]]

        if to_add in roles:
            ctx.send(
                "You will **lose access** to the server if you remove your proficiency!"
            )
            return None

        try:
            roles.remove(PROFICIENCY_MAP["beginner"])
        except ValueError:
            try:
                roles.remove(PROFICIENCY_MAP["intermediate"])
            except ValueError:
                roles.remove(PROFICIENCY_MAP["expert"])

        roles.append(to_add)

        ctx.member.modify(GUILD_ID, roles=roles)

        ctx.send(
            content=f"Your proficiency is now set to <@&{to_add}>",
            allowed_mentions={"parse": []},
        )

    @staticmethod
    async def edit_surfing_types(ctx: ComponentContext, values: list[str]):
        original = ctx.member.roles.copy()
        to_add = list(map(lambda r: SURFING_TYPES_MAP[r], values))
        removed = []
        roles = []
        for role in original:
            if role in {
                LONGBOARD,
                SHORTBOARD,
                SKIMBOARD,
                WAKEBOARD,
                KITEBOARD,
                WINDBOARD,
            }:
                if role in to_add:
                    to_add.remove(role)
                    removed.append(role)
                    continue
            roles.append(role)
        roles.extend(to_add)
        ctx.member.modify(roles=roles)

        ctx.send(
            f"""{"Added:" + " ".join(map(lambda r: f"<@&{r}>",to_add)) + " to your surfing types." if len(to_add) > 0 else ""}
{"Removed:" + " ".join(map(lambda r: f"<@&{r}>",removed)) + " from your surfing types." if len(to_add) > 0 else ""}""".strip(),
            allowed_mentions={"parse": []},
        )

    @staticmethod
    async def edit_pronouns(ctx: ComponentContext, values: list[str]):
        original = ctx.member.roles.copy()
        to_add = list(map(lambda r: PRONOUNS_MAP[r], values))
        removed = []
        roles = []
        for role in original:
            if role in {
                HE_HIM,
                SHE_HER,
                THEY_THEM,
                ASK,
                ANY,
            }:
                if role in to_add:
                    to_add.remove(role)
                    removed.append(role)
                    continue
            roles.append(role)
        roles.extend(to_add)
        ctx.member.modify(roles=roles)

        ctx.send(
            f"""{"Added:" + " ".join(map(lambda r: f"<@&{r}>",to_add)) + " to your pronouns." if len(to_add) > 0 else ""}
{"Removed:" + " ".join(map(lambda r: f"<@&{r}>",removed)) + " from your pronouns." if len(to_add) > 0 else ""}""".strip(),
            allowed_mentions={"parse": []},
        )


def setup(client: Client):
    Role(client)
