"""
Models module.
This module contains the database models for the application.
"""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlalchemy.pool import QueuePool
import logging
import time

# Configure logging
logger = logging.getLogger('sqlalchemy')
logger.setLevel(logging.INFO)

# Initialize SQLAlchemy with connection pooling configuration
db = SQLAlchemy(engine_options={
    'pool_size': 10,  # Maximum number of connections in the pool
    'max_overflow': 20,  # Maximum number of connections that can be created beyond pool_size
    'pool_timeout': 30,  # Seconds to wait before timing out on getting a connection from the pool
    'pool_recycle': 1800,  # Recycle connections after 30 minutes to avoid stale connections
    'pool_pre_ping': True,  # Enable connection health checks
    'poolclass': QueuePool  # Use QueuePool for connection pooling
})

# Add event listeners for database connection monitoring
@event.listens_for(Engine, "before_cursor_execute")
def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log query execution time."""
    conn.info.setdefault('query_start_time', []).append(time.time())
    logger.debug("Start Query: %s", statement)

@event.listens_for(Engine, "after_cursor_execute")
def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log query execution time."""
    total = time.time() - conn.info['query_start_time'].pop(-1)
    logger.debug("Query Complete: %s", statement)
    logger.debug("Total Time: %f", total)
    if total > 1.0:  # Log slow queries (more than 1 second)
        logger.warning("Slow Query: %s", statement)
        logger.warning("Parameters: %s", parameters)
        logger.warning("Execution Time: %f", total)

@event.listens_for(Engine, "connect")
def connect(dbapi_connection, connection_record):
    """Log connection creation."""
    logger.info("Database connection established")

@event.listens_for(Engine, "checkout")
def checkout(dbapi_connection, connection_record, connection_proxy):
    """Verify connection is still valid on checkout."""
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("SELECT 1")
    except Exception:
        # Raise DisconnectionError to trigger a reconnection
        logger.warning("Connection invalid, reconnecting...")
        raise db.DisconnectionError()
    finally:
        cursor.close()

@event.listens_for(Engine, "disconnect")
def disconnect(dbapi_connection, connection_record):
    """Log connection disconnection."""
    logger.info("Database connection closed")

# Import models after db initialization to avoid circular imports
from app.models.base import BaseModel, DatabaseError, NotFoundError, ValidationError, IntegrityConstraintViolation

# Import models in order to avoid circular imports
# First import models with no dependencies
from app.models.admin_user import AdminUser, AdminRole

# Then import models that depend on the above
from app.models.dashboard_note import DashboardNote
from app.models.user import User, Address, PaymentMethod
from app.models.product import Category, Product, ProductImage, ProductOption, ProductOptionValue
from app.models.service import Service, ServiceOption, ServiceOptionValue
from app.models.quote import QuoteRequest, QuoteFile, Quote, QuoteItem
from app.models.order import Order, OrderItem, OrderFile, OrderStatus, Payment, Delivery
from app.models.production import ProductionJob, ProductionStep