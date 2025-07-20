"""
Models module.
This module contains the database models for the application.
"""
from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

# Import models
from app.models.user import User
from app.models.product import Product, Category
from app.models.order import Order, OrderItem