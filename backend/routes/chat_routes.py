from flask import Blueprint, request, jsonify
from models.message import Message
from extensions import db
from services.chatbot_service import get_chatbot_response

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")

@chat_bp.route("/", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    response = get_chatbot_response(user_message)

    msg = Message(user_message=user_message, bot_reply=response)
    db.session.add(msg)
    db.session.commit()

    return jsonify({"response": response})