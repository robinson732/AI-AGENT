from extensions import db

class MenuItem(db.Model):
    __tablename__ = 'menu_item'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255))
    price = db.Column(db.Float)
    category = db.Column(db.String(50))
    vegetarian = db.Column(db.Boolean, default=False)
