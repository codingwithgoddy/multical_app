"""
Database initialization script.
Run this script to create the database tables and add some initial data.
"""
from app import app, db
from models import User, Product, Category, Order, OrderItem
from werkzeug.security import generate_password_hash
import os

def init_db():
    """Initialize the database with tables and sample data"""
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if we already have users
        if User.query.count() == 0:
            print("Adding sample users...")
            # Add admin user
            admin = User(
                username="admin",
                email="admin@multiprints.com",
                password_hash=generate_password_hash("admin123"),
                is_admin=True
            )
            
            # Add regular user
            user = User(
                username="customer",
                email="customer@example.com",
                password_hash=generate_password_hash("customer123"),
                is_admin=False
            )
            
            db.session.add(admin)
            db.session.add(user)
            db.session.commit()
            print("Sample users added.")
        
        # Check if we already have categories
        if Category.query.count() == 0:
            print("Adding sample categories...")
            categories = [
                Category(name="Business Cards", description="Professional business cards"),
                Category(name="Flyers", description="Marketing flyers and brochures"),
                Category(name="Banners", description="Large format banners"),
                Category(name="Stationery", description="Letterheads, envelopes, etc.")
            ]
            
            db.session.add_all(categories)
            db.session.commit()
            print("Sample categories added.")
        
        # Check if we already have products
        if Product.query.count() == 0:
            print("Adding sample products...")
            # Get categories
            business_cards = Category.query.filter_by(name="Business Cards").first()
            flyers = Category.query.filter_by(name="Flyers").first()
            banners = Category.query.filter_by(name="Banners").first()
            
            products = [
                Product(
                    name="Standard Business Card",
                    description="300gsm, full color, double-sided",
                    price=15.99,
                    image_url="https://via.placeholder.com/300x200?text=Business+Card",
                    category=business_cards
                ),
                Product(
                    name="Premium Business Card",
                    description="350gsm, full color, double-sided, spot UV",
                    price=25.99,
                    image_url="https://via.placeholder.com/300x200?text=Premium+Card",
                    category=business_cards
                ),
                Product(
                    name="A5 Flyer",
                    description="170gsm, full color, single-sided",
                    price=12.99,
                    image_url="https://via.placeholder.com/300x200?text=A5+Flyer",
                    category=flyers
                ),
                Product(
                    name="A4 Flyer",
                    description="170gsm, full color, double-sided",
                    price=18.99,
                    image_url="https://via.placeholder.com/300x200?text=A4+Flyer",
                    category=flyers
                ),
                Product(
                    name="Vinyl Banner",
                    description="440gsm, full color, with grommets",
                    price=45.99,
                    image_url="https://via.placeholder.com/300x200?text=Vinyl+Banner",
                    category=banners
                )
            ]
            
            db.session.add_all(products)
            db.session.commit()
            print("Sample products added.")
        
        print("Database initialization completed.")

if __name__ == "__main__":
    init_db()