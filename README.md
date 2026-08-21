# AI-AGENT

## Restaurant AI Backend MVP

This project is a Flask backend for a restaurant AI assistant with the following endpoints:

- `POST /chat` — customer chat powered by LangChain + OpenAI
- `POST /orders` — create and store a customer order
- `POST /reservations` — create and store a table reservation
- `GET /menu` — retrieve menu items from the database
- `GET /recommendations` — AI meal suggestions based on budget, dietary needs, or preferences

## Is this MVP free?

- The backend code itself is free to run locally.
- The AI part uses OpenAI via LangChain, so the model calls are not free unless you use a free OpenAI trial or a different local model.
- If you want a fully free MVP, the app can be adapted to a local open-source model instead of `gpt-5`.

## Run locally

1. Install Python dependencies:

```bash
cd server
pip install -r requirements.txt
```

2. Create or update `.env` in `server/` with:

```bash
SECRET_KEY=your-secret
DATABASE_URL=sqlite:///restaurant.db
OPENAI_API_KEY=your-openai-api-key
```

3. Initialize the database (first time only):

```bash
cd server
flask db init
flask db migrate -m "create restaurant tables"
flask db upgrade
```

4. Run the app:

```bash
cd server
python app.py
```

5. Test endpoints with curl or Postman:

```bash
curl http://127.0.0.1:5000/menu
curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d '{"message":"Hi"}'
```

## Notes

- The `.env` file in `server/` must contain a valid OpenAI API key for `/chat` and `/recommendations`.
- If you want, I can also add sample database seed data and a Postman collection.