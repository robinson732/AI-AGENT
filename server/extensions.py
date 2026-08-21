from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import redis

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

redis_client = None


def init_redis(app):
    global redis_client
    redis_client = redis.from_url(
        app.config["REDIS_URL"],
        decode_responses=True
    )


def register_jwt_callbacks(app):
    """
    Wires the JWT blocklist check into Redis.
    Must be called after init_redis().
    """

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        if redis_client is None:
            return False
        return redis_client.get(f"revoked_token:{jti}") is not None