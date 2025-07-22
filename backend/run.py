"""
Application entry point.
This module is the entry point for the application.
"""
import os
from app import create_app

# Get environment from environment variable or default to development
env = os.environ.get('FLASK_ENV', 'development')
app = create_app(env)

if __name__ == '__main__':
    # Use debug mode in development
    debug = env == 'development'
    app.run(
        host='0.0.0.0', 
        port=int(os.environ.get('PORT', 5000)),
        debug=debug
    )