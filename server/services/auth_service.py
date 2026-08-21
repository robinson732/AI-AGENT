from functools import wraps

from flask import jsonify
from flask_jwt_extended import (
    get_jwt,
    verify_jwt_in_request,
)
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db, redis_client
from models import User


class AuthError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def create_staff_user(name: str, email: str, password: str, role: str) -> User:
    """
    Admin-only. Creates a staff or admin account.
    Must only be called from a route protected by role_required("admin"),
    or from the flask create-admin CLI bootstrap command.
    """
    if not name or not email or not password:
        raise AuthError("name, email and password are required", 400)

    if role not in ("staff", "admin"):
        raise AuthError("role must be 'staff' or 'admin'", 400)

    email = email.strip().lower()

    existing = User.query.filter_by(email=email).first()
    if existing:
        raise AuthError("an account with this email already exists", 409)

    user = User(
        name=name.strip(),
        email=email,
        password_hash=generate_password_hash(password),
        role=role,
        is_active=True,
    )

    db.session.add(user)
    db.session.commit()

    return user


def authenticate_user(email: str, password: str) -> User:
    if not email or not password:
        raise AuthError("email and password are required", 400)

    email = email.strip().lower()
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        raise AuthError("invalid email or password", 401)

    if not user.is_active:
        raise AuthError("this account is inactive", 403)

    return user


def revoke_token(jti: str, ttl_seconds: int):
    """
    Add a token's jti to the Redis blocklist until it would have expired anyway.
    """
    if redis_client is None:
        return
    redis_client.setex(f"revoked_token:{jti}", ttl_seconds, "1")


def role_required(*allowed_roles):
    """
    Decorator for routes that require the caller to have one of the given roles.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role")

            if role not in allowed_roles:
                return jsonify({"error": "insufficient permissions"}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator 