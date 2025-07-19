# Example health check endpoint for Flask backend
# This file is for reference only and should be integrated into your Flask application

from flask import Blueprint, jsonify, current_app
import psycopg2
from datetime import datetime
import cloudinary

health = Blueprint('health', __name__)

@health.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for the backend service.
    Returns status of the application and its dependencies.
    """
    status = {
        'status': 'ok',
        'timestamp': datetime.utcnow().isoformat(),
        'version': current_app.config.get('VERSION', 'unknown'),
        'environment': current_app.config.get('FLASK_ENV', 'unknown'),
        'services': {
            'database': check_database(),
            'cloudinary': check_cloudinary()
        }
    }
    
    # If any service is down, return 503
    if any(v != 'ok' for v in status['services'].values()):
        status['status'] = 'degraded'
        return jsonify(status), 503
    
    return jsonify(status)

def check_database():
    """Check database connection"""
    try:
        # Try to connect to the database
        conn = psycopg2.connect(current_app.config['SQLALCHEMY_DATABASE_URI'])
        conn.close()
        return 'ok'
    except Exception as e:
        current_app.logger.error(f"Database health check failed: {str(e)}")
        return 'error'

def check_cloudinary():
    """Check Cloudinary connection"""
    try:
        # Try to ping Cloudinary
        result = cloudinary.api.ping()
        return 'ok'
    except Exception as e:
        current_app.logger.error(f"Cloudinary health check failed: {str(e)}")
        return 'error'

# To register this blueprint in your Flask app:
# from app.routes.health import health
# app.register_blueprint(health)