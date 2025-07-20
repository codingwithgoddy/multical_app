"""
Models module.
This module contains the database models for the application.
"""
from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

# Import models
from app.models.user import User, Address, PaymentMethod
from app.models.product import Category, Product, ProductImage, ProductOption, ProductOptionValue
from app.models.service import Service, ServiceOption, ServiceOptionValue
from app.models.quote import QuoteRequest, QuoteFile, Quote, QuoteItem
from app.models.order import Order, OrderItem, OrderFile, OrderStatus, Payment, Delivery
from app.models.production import ProductionJob, ProductionStep