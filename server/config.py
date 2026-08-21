import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    REDIS_URL = os.getenv(
        "REDIS_URL",
        "redis://localhost:6379/0"
    )

    OLLAMA_MODEL = os.getenv(
        "OLLAMA_MODEL",
        "llama3.2"
    )

    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173"
    )

    # --- JWT ---
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    if not JWT_SECRET_KEY:
        raise RuntimeError(
            "JWT_SECRET_KEY is not set. Add it to your .env file."
        )

    JWT_ACCESS_TOKEN_EXPIRES = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", "15")
    ) * 60

    JWT_REFRESH_TOKEN_EXPIRES = int(
        os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", "30")
    ) * 24 * 60 * 60

    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]