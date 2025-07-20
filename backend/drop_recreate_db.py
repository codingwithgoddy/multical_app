"""
Script to drop all tables and recreate them.
Use this script to reset the database when model changes are made.
"""
from app import create_app
from app.models import db

def drop_recreate_db():
    """Drop all tables and recreate them"""
    app = create_app('development')
    
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        print("Database tables have been reset.")

if __name__ == "__main__":
    drop_recreate_db()