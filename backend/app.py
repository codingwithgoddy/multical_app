from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from models import db, User, Product, Category, Order, OrderItem

# Load environment variables from .env file
load_dotenv()

# Create Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-never-use-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/multiprints_dev')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Cloudinary configuration
app.config['CLOUDINARY_CLOUD_NAME'] = os.environ.get('CLOUDINARY_CLOUD_NAME')
app.config['CLOUDINARY_API_KEY'] = os.environ.get('CLOUDINARY_API_KEY')
app.config['CLOUDINARY_API_SECRET'] = os.environ.get('CLOUDINARY_API_SECRET')

# M-Pesa configuration
app.config['MPESA_API_KEY'] = os.environ.get('MPESA_API_KEY')
app.config['MPESA_API_SECRET'] = os.environ.get('MPESA_API_SECRET')
app.config['MPESA_SHORTCODE'] = os.environ.get('MPESA_SHORTCODE')
app.config['MPESA_PASSKEY'] = os.environ.get('MPESA_PASSKEY')

# Application configuration
app.config['APP_NAME'] = os.environ.get('APP_NAME', 'Multiprints Business System')
app.config['ADMIN_EMAIL'] = os.environ.get('ADMIN_EMAIL', 'admin@multiprints.com')
app.config['FRONTEND_URL'] = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Initialize extensions
db.init_app(app)

@app.route('/api/v1/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Backend service is running'
    })

@app.route('/api/v1/')
def index():
    """API root endpoint"""
    return jsonify({
        'message': 'Welcome to Multiprints API',
        'version': '0.1.0',
        'endpoints': {
            'health': '/api/v1/health'
        }
    })

if __name__ == '__main__':
    app.run(debug=True)