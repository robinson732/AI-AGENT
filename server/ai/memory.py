import json

from langchain_core.messages import (
    messages_to_dict,
    messages_from_dict,
)

import extensions


HISTORY_TTL = 60 * 60 * 24

MAX_RECENT_MESSAGES = 12


def _history_key(session_id: str) -> str:
    return f"chat:history:{session_id}"


def _summary_key(session_id: str) -> str:
    return f"chat:summary:{session_id}"


# =========================================================
# HISTORY
# =========================================================

def get_history(session_id: str):

    key = _history_key(session_id)

    data = extensions.redis_client.get(key)

    if not data:
        return []

    try:

        return messages_from_dict(
            json.loads(data)
        )

    except (json.JSONDecodeError, TypeError, ValueError):

        return []


def save_history(
    session_id: str,
    messages: list
):

    key = _history_key(session_id)

    data = messages_to_dict(messages)

    extensions.redis_client.setex(
        key,
        HISTORY_TTL,
        json.dumps(data)
    )


# =========================================================
# SUMMARY
# =========================================================

def get_summary(session_id: str):

    return (
        extensions.redis_client.get(
            _summary_key(session_id)
        )
        or ""
    )


def save_summary(
    session_id: str,
    summary: str
):

    extensions.redis_client.setex(
        _summary_key(session_id),
        HISTORY_TTL,
        summary
    )


# =========================================================
# CLEAR
# =========================================================

def clear_history(session_id: str):

    extensions.redis_client.delete(
        _history_key(session_id)
    )

    extensions.redis_client.delete(
        _summary_key(session_id)
    )