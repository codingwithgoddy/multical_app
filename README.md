# Multiprints Business Management System

[![Full Stack CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Full%20Stack%20CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/ci.yml)
[![Backend CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Backend%20CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/backend-ci.yml)
[![Admin Frontend CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Admin%20Frontend%20CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/admin-frontend-ci.yml)
[![Customer Frontend CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Customer%20Frontend%20CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/customer-frontend-ci.yml)

A comprehensive business management system designed to help small to medium printing businesses transition from manual operations to a fully digital workflow.

## Architecture

- **Backend**: Flask REST API with PostgreSQL database
- **Frontend**: Next.js application with both admin dashboard and customer website
- **File Storage**: Cloudinary integration for images and design files
- **Payments**: Mpesa STK Push and Paybill integration

## Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Git

### Project Structure

```
├── backend/              # Flask API server
├── frontend/             # Next.js application (admin + customer)
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

### Getting Started

1. Clone the repository
2. Set up the local PostgreSQL database
3. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env  # Configure your environment variables
   python init_db.py     # Initialize the database
   python run.py         # Start the Flask server
   ```
4. Set up the frontend:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local  # Configure your environment variables
   npm run dev
   ```

5. Alternatively, use the development script to start both servers:
   ```bash
   ./scripts/dev.sh
   ```

### API Integration Testing

The project includes tools to test the API integration between frontend and backend:

1. **API Status Component**: The dashboard includes an API status component that shows the current connection status to the backend API.

2. **API Test Page**: A dedicated API test page is available at `/api-test` that allows you to test various API endpoints directly from the browser.

3. **Health Check Script**: Run the backend health check script to verify API connectivity:
   ```bash
   python docs/backend-health-check.py
   ```

4. **Smoke Tests**: Run basic smoke tests to verify that both frontend and backend are working correctly:
   ```bash
   ./scripts/run-smoke-tests.sh
   ```

### CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Full Stack CI**: Runs all component tests together
- **Backend CI**: Tests Flask API with PostgreSQL
- **Admin Frontend CI**: Tests Next.js admin dashboard
- **Customer Frontend CI**: Tests Next.js customer website

All workflows run on push to `main` and `develop` branches, as well as on pull requests.

## Features

- Digital product catalog management
- Customer order tracking and management
- Payment processing with Mpesa integration
- File upload and storage via Cloudinary
- Business analytics and reporting
- Multi-admin collaboration system
- Delivery location management
- Service quote request system

## License

This project is proprietary software for Multiprints business operations.