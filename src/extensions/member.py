from __future__ import annotations

from asyncio import sleep
from typing import TYPE_CHECKING
from os import getenv

from interactions import Extension

if TYPE_CHECKING:
    from interactions import Client, GuildMember

BEGINNER = getenv("BEGINNER", "")
INTERMEDIATE = getenv("INTERMEDIATE", "")
EXPERT = getenv("EXPERT", "")

WELCOME_CHANNEL = getenv("WELCOME_CHANNEL", "")
BOT_ID = getenv("BOT_ID", "")


class Member(Extension):
    def __init__(self, client: Client):
        self.client = client
        self.client.event(self.on_guild_member_add)  # type: ignore
        self.client.event(self.on_guild_member_update)  # type: ignore

    @staticmethod
    async def on_guild_member_add(member: GuildMember) -> None:
        assert member._client is not None
        assert member.user is not None

        client = member._client
        guild_id = int(member.guild_id)
        user = int(member.user.id)

        # 5 minute window for selecting roles
        await sleep(60 * 5)

        member_obj = await client.get_member(guild_id, user)
        assert member_obj is not None
        roles = member_obj["roles"]

        # Give beginner if has role(s) but not one which is a
        # proficiency role
        if len(roles) > 0 and (
            (BEGINNER not in roles)
            or (INTERMEDIATE not in roles)
            or (EXPERT not in roles)
        ):
            await client.add_member_role(
                guild_id,
                user,
                int(BEGINNER),
                reason="Did not select Proficiency in 5 minutes",
            )
            print(f"Force added beginner role to {user}")

        # Sleep for 60 * 55, not 60 * 60 because we already slept for
        # 5 minutes before
        await sleep(60 * 55)

        member_obj = await client.get_member(guild_id, user)
        assert member_obj is not None
        roles = member_obj["roles"]

        # Kick user if they do not have any role,
        # Logic:
        # -> Selects some role
        # -> Gets `Beginner` if did not select proficiency
        # -> Has more than 0 roles, aka verified member
        # -> Does not get kicked
        if len(roles) == 0:
            await client.create_guild_kick(
                guild_id, user, reason="Did not select any role in under an hour"
            )
            print(f"Kicked {user} for not selecting any role in under an hour")

        return None

    @staticmethod
    async def on_guild_member_update(member: GuildMember):
        assert member._client is not None
        assert member.roles is not None
        assert member.user is not None

        if str(member.user.id) == BOT_ID:
            return

        if (
            (BEGINNER in member.roles)
            or (INTERMEDIATE in member.roles)
            or (EXPERT in member.roles)
        ):
            await member._client.send_message(
                int(WELCOME_CHANNEL),
                f"Welcome to Surfers Camp <@!{member.user.id}>",
                allowed_mentions={"parse": []},
            )
            print(f"Sent welcome message for member {member.user.id}")


def setup(client: Client):
    Member(client)
