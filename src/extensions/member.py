from __future__ import annotations

from asyncio import sleep
from logging import getLogger
from typing import TYPE_CHECKING

from interactions import Extension

from .constants import BEGINNER, EXPERT, INTERMEDIATE

if TYPE_CHECKING:
    from interactions import Client, GuildMember

log = getLogger(__name__)


class Member(Extension):
    def __init__(self, client: Client):
        self.client = client
        self.client.event(self.on_guild_member_add)  # type: ignore

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

        roles: list[int] = list(map(lambda role: int(role), member_obj["roles"]))  # type: ignore

        # Give beginner if has role(s) but not one which is a
        # proficiency role
        if len(roles) > 0 and (
            (BEGINNER not in roles)
            and (INTERMEDIATE not in roles)
            and (EXPERT not in roles)
        ):
            await client.add_member_role(
                guild_id,
                user,
                BEGINNER,
                reason="Did not select Proficiency in 5 minutes",
            )
            log.info(f"Force added beginner role to {user}")

        # Sleep for 60 * 55, not 60 * 60 because we already slept for
        # 5 minutes before
        await sleep(60 * 55)

        member_obj = await client.get_member(guild_id, user)
        assert member_obj is not None

        roles: list[str] = member_obj["roles"]

        # Kick user if they do not have any role,
        # Logic:
        # -> Selects some role
        # -> Gets `Beginner` if did not select proficiency
        # -> Has more than 0 roles, aka verified not-a-bot member
        # -> Does not get kicked
        if len(roles) == 0:
            await client.create_guild_kick(
                guild_id, user, reason="Did not select any role in under an hour"
            )
            log.info(f"Kicked {user} for not selecting any role in under an hour")

        return None


def setup(client: Client):
    Member(client)
