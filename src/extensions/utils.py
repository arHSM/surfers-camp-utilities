from typing import Callable

from interactions import Button


def role_diff(
    roles: list[int], selected: list[int]
) -> tuple[list[int], list[int], list[int]]:
    new_roles: list[int] = []
    removed: list[int] = []

    for role in roles:
        if role in selected:
            selected.remove(role)
            removed.append(role)
            continue
        new_roles.append(role)

    new_roles.extend(selected)

    return (new_roles, selected, removed)


get_style: Callable[[int, int], int] = (
    lambda active, index: 1 if index == active else 3 if active == -1 else 2
)


def create_buttons(active: int) -> list[Button]:
    return [
        Button(
            style=get_style(active, 1), label="Proficiency", custom_id="proficiency"
        ),
        Button(
            style=get_style(active, 2), label="Surfing Types", custom_id="surfing_types"
        ),
        Button(style=get_style(active, 3), label="Pronouns", custom_id="pronouns"),
    ]
