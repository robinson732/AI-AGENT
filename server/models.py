from extensions import db
from datetime import datetime, timezone


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    slug = db.Column(db.String(150), nullable=False, unique=True, index=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }


class Menu(db.Model):
    __tablename__ = "menu"

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=True, index=True
    )
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    available = db.Column(db.Boolean, default=True)
    ingredients = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "restaurant_id": self.restaurant_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "available": self.available,
            "ingredients": self.ingredients,
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=True, index=True
    )
    customer_name = db.Column(db.String(120), nullable=False)
    items = db.Column(db.JSON, nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "restaurant_id": self.restaurant_id,
            "customer_name": self.customer_name,
            "items": self.items,
            "total": self.total,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class Reservation(db.Model):
    __tablename__ = "reservations"

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=True, index=True
    )
    name = db.Column(db.String(120), nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    reserved_at = db.Column(db.DateTime, nullable=False)
    contact = db.Column(db.String(120))
    notes = db.Column(db.Text)
    status = db.Column(db.String(50), default="booked")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "restaurant_id": self.restaurant_id,
            "name": self.name,
            "guests": self.guests,
            "reserved_at": self.reserved_at.isoformat(),
            "contact": self.contact,
            "notes": self.notes,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=True, index=True
    )
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="staff")
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    VALID_ROLES = ("staff", "admin")

    def to_dict(self):
        return {
            "id": self.id,
            "restaurant_id": self.restaurant_id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }