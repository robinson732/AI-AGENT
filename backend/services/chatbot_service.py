from mistralai.client import MistralClient
from flask import current_app

def get_chatbot_response(user_message):
    api_key = current_app.config['MISTRAL_API_KEY']
    if not api_key:
        return "Sorry, AI service is not configured."

    try:
        client = MistralClient(api_key=api_key)
        response = client.chat(
            model="mistral-medium",
            messages=[
                {"role": "system", "content": "You are a helpful restaurant chatbot for a fine dining establishment. Help customers with menu inquiries, placing orders, making reservations, and general restaurant information. Be polite, informative, and engaging."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return "Sorry, I'm having trouble responding right now."