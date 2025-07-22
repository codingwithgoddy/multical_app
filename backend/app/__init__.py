"""
Application initialization module.
This module initializes the Flask application and its extensions.
"""
from flask import Flask, jsonify, request
from datetime import datetime
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv
import psycopg2
from sqlalchemy.exc import SQLAlchemyError

# Import models
from app.models import db, DatabaseError, NotFoundError, ValidationError, IntegrityConstraintViolation

# Load environment variables
load_dotenv()

def create_app(config_name=None):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Determine configuration based on environment variable if not specified
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    # Load configuration
    if config_name == 'production':
        app.config.from_object('app.config.ProductionConfig')
    elif config_name == 'staging':
        app.config.from_object('app.config.StagingConfig')
    elif config_name == 'testing':
        app.config.from_object('app.config.TestingConfig')
    else:
        app.config.from_object('app.config.DevelopmentConfig')
    
    # Configure logging
    configure_logging(app, config_name)
    
    # Initialize extensions with specific CORS settings
    CORS(app, resources={r"/*": {"origins": "*", "supports_credentials": True, "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}}, allow_headers=["Content-Type", "Authorization"])
    
    # Initialize database with error handling
    try:
        db.init_app(app)
        app.logger.info("Database initialized successfully")
    except SQLAlchemyError as e:
        app.logger.error(f"Failed to initialize database: {str(e)}")
        # Continue initialization to allow the application to start
        # Database errors will be handled at runtime
    
    # Initialize migrations
    try:
        migrate = Migrate(app, db)
        app.logger.info("Database migrations initialized successfully")
    except Exception as e:
        app.logger.error(f"Failed to initialize migrations: {str(e)}")
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    # Register blueprints
    from app.routes.main import main_bp
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.orders import orders_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(products_bp, url_prefix='/api/v1/products')
    app.register_blueprint(orders_bp, url_prefix='/api/v1/orders')
    
    # Register error handlers
    register_error_handlers(app)
    
    # Add health check endpoint
    @app.route('/health')
    def health_check():
        """Health check endpoint for monitoring"""
        try:
            # Check database connection
            with db.engine.connect() as connection:
                connection.execute("SELECT 1")
            
            return jsonify({
                'status': 'healthy',
                'database': 'connected',
                'environment': config_name
            }), 200
        except SQLAlchemyError as e:
            app.logger.error(f"Health check failed - database error: {str(e)}")
            return jsonify({
                'status': 'unhealthy',
                'database': 'disconnected',
                'error': str(e),
                'environment': config_name
            }), 503
    
    return app

def configure_logging(app, config_name):
    """Configure logging for the application"""
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    # Set log level based on environment
    if config_name == 'production' or config_name == 'staging':
        log_level = logging.INFO
    else:
        log_level = logging.DEBUG
    
    # Configure file handler
    file_handler = RotatingFileHandler(
        'logs/multiprints.log', 
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(log_level)
    
    # Configure app logger
    app.logger.setLevel(log_level)
    app.logger.addHandler(file_handler)
    
    # Log application startup
    app.logger.info(f"Multiprints Business System starting in {config_name} environment")

def register_error_handlers(app):
    """Register error handlers for the application"""
    @app.errorhandler(404)
    def not_found(error):
        app.logger.info(f"Not found: {request.path}")
        return jsonify({
            'error': {
                'code': 'NOT_FOUND',
                'message': 'The requested resource was not found',
                'details': str(error),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 404
    
    @app.errorhandler(500)
    def internal_server_error(error):
        app.logger.error(f"Internal server error: {str(error)}")
        return jsonify({
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An internal server error occurred',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 500
    
    @app.errorhandler(ValidationError)
    def validation_error(error):
        app.logger.info(f"Validation error: {str(error)}")
        return jsonify({
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Invalid input data',
                'details': str(error),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 400
    
    @app.errorhandler(NotFoundError)
    def not_found_error(error):
        app.logger.info(f"Resource not found: {str(error)}")
        return jsonify({
            'error': {
                'code': 'RESOURCE_NOT_FOUND',
                'message': 'The requested resource was not found',
                'details': str(error),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 404
    
    @app.errorhandler(IntegrityConstraintViolation)
    def integrity_error(error):
        app.logger.info(f"Integrity constraint violation: {str(error)}")
        return jsonify({
            'error': {
                'code': 'INTEGRITY_ERROR',
                'message': 'Data integrity constraint violated',
                'details': str(error),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 409
    
    @app.errorhandler(DatabaseError)
    def database_error(error):
        app.logger.error(f"Database error: {str(error)}")
        return jsonify({
            'error': {
                'code': 'DATABASE_ERROR',
                'message': 'A database error occurred',
                'details': str(error),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 500
    
    @app.errorhandler(SQLAlchemyError)
    def sqlalchemy_error(error):
        app.logger.error(f"SQLAlchemy error: {str(error)}")
        return jsonify({
            'error': {
                'code': 'DATABASE_ERROR',
                'message': 'A database error occurred',
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 500