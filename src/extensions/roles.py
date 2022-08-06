from __future__ import annotations

from typing import TYPE_CHECKING

from interactions import Button, Emoji, SelectMenu, SelectOption

from extensions.utils import create_buttons, role_diff

from .constants import (
    ANY,
    ANY_EMOJI,
    ASK,
    ASK_EMOJI,
    BEGINNER,
    BEGINNER_EMOJI,
    EXPERT,
    EXPERT_EMOJI,
    GUILD_ID,
    HE_HIM,
    HE_HIM_EMOJI,
    INTERMEDIATE,
    INTERMEDIATE_EMOJI,
    INTRODUCTION_CHANNEL,
    KITEBOARD,
    KITEBOARD_EMOJI,
    LONGBOARD,
    LONGBOARD_EMOJI,
    SHE_HER,
    SHE_HER_EMOJI,
    SHORTBOARD,
    SHORTBOARD_EMOJI,
    SKIMBOARD,
    SKIMBOARD_EMOJI,
    THEY_THEM,
    THEY_THEM_EMOJI,
    WAKEBOARD,
    WAKEBOARD_EMOJI,
    WELCOME_CHANNEL,
    WINDBOARD,
    WINDBOARD_EMOJI,
)

if TYPE_CHECKING:
    from interactions import Client, ComponentContext

PROFICIENCY_MAP = {
    "beginner": BEGINNER,
    "intermediate": INTERMEDIATE,
    "expert": EXPERT,
}

SURFING_TYPES_MAP = {
    "longboard": LONGBOARD,
    "shortboard": SHORTBOARD,
    "skimboard": SKIMBOARD,
    "wakeboard": WAKEBOARD,
    "kiteboard": KITEBOARD,
    "windboard": WINDBOARD,
}

PRONOUNS_MAP = {
    "he_him": HE_HIM,
    "she_her": SHE_HER,
    "they_them": THEY_THEM,
    "ask_pronouns": ASK,
    "any_pronouns": ANY,
}


class Role:
    def __init__(self, client: Client):
        self.client = client

        # Main role prompt
        self.client.component("get_roles")(self.send_role_prompt)  # type: ignore

        # Role *types*
        self.client.component("proficiency")(self.send_proficiency)  # type: ignore
        self.client.component("surfing_types")(self.send_surfing_types)  # type: ignore
        self.client.component("pronouns")(self.send_pronouns)  # type: ignore

        # Edit callbacks
        self.client.component("proficiency_dropdown")(self.edit_proficiency)  # type: ignore
        self.client.component("surfing_types_dropdown")(self.edit_surfing_types)  # type: ignore
        self.client.component("pronouns_dropdown")(self.edit_pronouns)  # type: ignore

    @staticmethod
    async def send_role_prompt(ctx: ComponentContext) -> None:
        await ctx.send(
            content="Pick your **Proficiency** in order to access the community.\nPick surfing types and pronouns to let the community know more about you!",
            ephemeral=True,
            components=create_buttons(1),
        )

    @staticmethod
    async def send_proficiency(ctx: ComponentContext):
        await ctx.edit(components=create_buttons(2))
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
            components=create_buttons(3),
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
            components=create_buttons(-1),
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
        had_proficiency = False

        if to_add in roles:
            await ctx.send(
                "You will **lose access** to the server if you remove your proficiency!",
                ephemeral=True,
            )
            return None

        try:
            roles.remove(BEGINNER)
        except ValueError:
            try:
                roles.remove(INTERMEDIATE)
            except ValueError:
                roles.remove(EXPERT)
            else:
                had_proficiency = True
        else:
            had_proficiency = True

        roles.append(to_add)

        await ctx.member.modify(GUILD_ID, roles=roles, reason="Selected by user")

        await ctx.send(
            content=f"Your proficiency is now set to <@&{to_add}>",
            allowed_mentions={"parse": []},  # type: ignore
            ephemeral=True,
        )

        if not had_proficiency:
            await ctx.client.send_message(
                WELCOME_CHANNEL,
                f"Welcome to Surfers Camp {ctx.member.mention}",
                allowed_mentions={"parse": []},
            )

    @staticmethod
    async def edit_surfing_types(ctx: ComponentContext, values: list[str]):
        (roles, added, removed) = role_diff(
            ctx.member.roles, list(map(lambda r: SURFING_TYPES_MAP[r], values))
        )

        await ctx.member.modify(GUILD_ID, roles=roles, reason="Selected by user")

        await ctx.send(
            f"""{"Added:" + " ".join(map(lambda r: f"<@&{r}>", removed)) + " to your surfing types." if len(removed) > 0 else ""}
{"Removed:" + " ".join(map(lambda r: f"<@&{r}>",removed)) + " from your surfing types." if len(removed) > 0 else ""}""".strip(),
            allowed_mentions={"parse": []},  # type: ignore
            ephemeral=True,
        )

    @staticmethod
    async def edit_pronouns(ctx: ComponentContext, values: list[str]):
        (roles, added, removed) = role_diff(
            ctx.member.roles, list(map(lambda r: PRONOUNS_MAP[r], values))
        )

        await ctx.member.modify(GUILD_ID, roles=roles, reason="Selected by user")

        await ctx.send(
            f"""{"Added:" + " ".join(map(lambda r: f"<@&{r}>", added)) + " to your pronouns." if len(added) > 0 else ""}
{"Removed:" + " ".join(map(lambda r: f"<@&{r}>",removed)) + " from your pronouns." if len(removed) > 0 else ""}""".strip(),
            allowed_mentions={"parse": []},  # type: ignore
            ephemeral=True,
        )


def setup(client: Client):
    Role(client)
