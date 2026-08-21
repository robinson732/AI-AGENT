conversations = {}


def get_session(session_id):
    if session_id not in conversations:
        conversations[session_id] = {
            "messages": [],
            "pending_order": None,
            "pending_reservation": None,
        }

    return conversations[session_id]