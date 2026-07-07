from extensions import db
from datetime import datetime, timezone


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    customer_name = db.Column(db.String(120), nullable=False)

    item_id = db.Column(db.Integer, db.ForeignKey('menu_item.id'), nullable=False)
    item = db.relationship('MenuItem', backref='orders')

    quantity = db.Column(db.Integer, default=1)

    total_price = db.Column(db.Float)

    status = db.Column(db.String(50), default="pending")

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))