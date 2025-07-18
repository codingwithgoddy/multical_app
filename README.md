# Multiprints Business Management System

[![Full Stack CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Full%20Stack%20CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/ci.yml)
[![Backend CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Backend%20CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/backend-ci.yml)
[![Admin Frontend CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Admin%20Frontend%20CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/admin-frontend-ci.yml)
[![Customer Frontend CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Customer%20Frontend%20CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/customer-frontend-ci.yml)

A comprehensive business management system designed to help small to medium printing businesses transition from manual operations to a fully digital workflow.

## Architecture

- **Backend**: Flask REST API with PostgreSQL database
- **Admin Dashboard**: Next.js application for business management
- **Customer Website**: Next.js application for service browsing and ordering
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
├── admin-frontend/       # Next.js admin dashboard
├── customer-frontend/    # Next.js customer website
├── .github/workflows/    # CI/CD workflows
└── .kiro/specs/         # Project specifications
```

### Getting Started

1. Clone the repository
2. Set up the backend (see `backend/README.md`)
3. Set up the admin frontend (see `admin-frontend/README.md`)
4. Set up the customer frontend (see `customer-frontend/README.md`)

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