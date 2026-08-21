from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    get_jwt_identity,
)

from extensions import db
from models import User
from services.auth_service import (
    AuthError,
    create_staff_user,
    authenticate_user,
    revoke_token,
    role_required,
)


auth = Blueprint("auth", __name__, url_prefix="/auth")


def _issue_tokens(user: User):
    extra_claims = {"role": user.role}

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims=extra_claims,
    )
    refresh_token = create_refresh_token(
        identity=str(user.id),
        additional_claims=extra_claims,
    )

    return access_token, refresh_token


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    try:
        user = authenticate_user(
            email=data.get("email"),
            password=data.get("password"),
        )
    except AuthError as e:
        return jsonify({"error": e.message}), e.status_code

    access_token, refresh_token = _issue_tokens(user)

    return jsonify({
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token,
    }), 200


@auth.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = db.session.get(User, int(identity))

    if not user or not user.is_active:
        return jsonify({"error": "account not available"}), 403

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    return jsonify({"access_token": access_token}), 200


@auth.route("/me", methods=["GET"])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = db.session.get(User, int(identity))

    if not user:
        return jsonify({"error": "user not found"}), 404

    return jsonify({"user": user.to_dict()}), 200


@auth.route("/staff", methods=["POST"])
@role_required("admin")
def create_staff():
    data = request.get_json() or {}

    try:
        user = create_staff_user(
            name=data.get("name"),
            email=data.get("email"),
            password=data.get("password"),
            role=data.get("role"),
        )
    except AuthError as e:
        return jsonify({"error": e.message}), e.status_code

    return jsonify({"user": user.to_dict()}), 201


@auth.route("/logout", methods=["POST"])
@jwt_required(verify_type=False)
def logout():
    claims = get_jwt()
    jti = claims["jti"]
    exp = claims["exp"]
    now = claims["iat"]

    ttl = max(exp - now, 1)
    revoke_token(jti, ttl)

    return jsonify({"message": "successfully logged out"}), 200