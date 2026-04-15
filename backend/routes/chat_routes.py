from flask import Blueprint, request, jsonify
from models.message import Message
from extensions import db

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")

@chat_bp.route("/", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    # simple rule bot
    if "menu" in user_message.lower():
        response = "You can ask for pizza, burger, pasta, or salads."
    elif "reservation" in user_message.lower():
        response = "Sure! How many guests?"
    else:
        response = "Sorry, I didn't understand that."

    msg = Message(user_message=user_message, bot_response=response)
    db.session.add(msg)
    db.session.commit()

    return jsonify({"response": response})