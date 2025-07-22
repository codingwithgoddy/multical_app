# Multiprints Backend

This is the backend API for the Multiprints Business Management System.

## Project Structure

The backend follows the MVC (Model-View-Controller) pattern:

```
backend/
├── app/                    # Application package
│   ├── __init__.py         # Application factory
│   ├── config/             # Configuration
│   ├── models/             # Database models
│   ├── controllers/        # Business logic
│   ├── routes/             # API routes
│   ├── services/           # External services integration
│   ├── utils/              # Utility functions
│   └── views/              # View functions (if needed)
├── migrations/             # Database migrations
├── tests/                  # Test suite
├── .env.example            # Environment variables example
├── init_db.py              # Database initialization script
├── requirements.txt        # Dependencies
└── run.py                  # Application entry point
```

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file to add your configuration.

5. Set up the database:
   ```bash
   # Create the database
   createdb multiprints_dev
   
   # Initialize the database with sample data
   python init_db.py
   
   # For future migrations
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

6. Run the application:
   ```bash
   python run.py
   ```

## API Endpoints

### Main
- `GET /api/v1/health`: Health check endpoint
- `GET /api/v1/`: API root endpoint

### Authentication
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Login a user
- `GET /api/v1/auth/me`: Get current user (requires authentication)

### Products
- `GET /api/v1/products`: Get all products
- `GET /api/v1/products/<id>`: Get a product by ID
- `POST /api/v1/products`: Add a new product (admin only)
- `PUT /api/v1/products/<id>`: Update a product (admin only)
- `DELETE /api/v1/products/<id>`: Delete a product (admin only)

### Categories
- `GET /api/v1/products/categories`: Get all categories
- `GET /api/v1/products/categories/<id>`: Get a category by ID
- `POST /api/v1/products/categories`: Add a new category (admin only)
- `PUT /api/v1/products/categories/<id>`: Update a category (admin only)
- `DELETE /api/v1/products/categories/<id>`: Delete a category (admin only)

### Orders
- `GET /api/v1/orders`: Get all orders (admin) or user orders (customer)
- `GET /api/v1/orders/<id>`: Get an order by ID
- `POST /api/v1/orders`: Add a new order
- `PUT /api/v1/orders/<id>/status`: Update order status (admin only)

## Development

- To add new models, create them in the `app/models` directory
- To add new controllers, create them in the `app/controllers` directory
- To add new routes, create them in the `app/routes` directory
- To run tests: `pytest`

## API Testing

### Using the Health Check Script

You can use the provided health check script to verify that the backend API is running and accessible:

```bash
python docs/backend-health-check.py
```

This script will check if the API health endpoint and root endpoint are accessible and return the expected responses.

### Using the Frontend API Test Page

The frontend includes an API test page that allows you to test various API endpoints:

1. Start the backend server:
   ```bash
   cd backend
   python run.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to the API test page in your browser:
   ```
   http://localhost:3000/api-test
   ```

4. Use the API test page to send requests to different endpoints and view the responses.

### Common API Testing Scenarios

1. **Health Check**: Test if the API is running
   - Endpoint: `GET /api/v1/health`
   - Expected response: Status 200 with health information

2. **Authentication**: Test login functionality
   - Endpoint: `POST /api/v1/auth/login`
   - Request body: `{"email": "admin@example.com", "password": "password123"}`
   - Expected response: Status 200 with access token and user information

3. **Protected Endpoints**: Test endpoints that require authentication
   - First login to get an access token
   - Then use the token to access protected endpoints like `GET /api/v1/auth/me`