"""
This module is a wrapper around the application factory in app/__init__.py.
It's kept for backward compatibility but the main application logic is in app/__init__.py.
"""
from app import create_app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    # Run the application
    app.run(debug=app.config.get('DEBUG', False))