# Staging Environment

This document explains the staging environment setup for the Multiprints Business System.

## Overview

The staging environment is a complete replica of the production environment, used for testing and validation before deploying to production. It uses free tiers of various services to minimize costs during development.

## Components

- **Backend**: Render Web Service (Free Tier)
  - URL: https://multiprints-backend-staging.onrender.com
  - GitHub Branch: `develop`

- **Database**: Render PostgreSQL (Free Trial)
  - Name: multiprints-staging-db
  - Connection: Internal connection to backend

- **Frontend**: Vercel (Free Tier)
  - URL: https://multiprints-staging.vercel.app
  - GitHub Branch: `develop`
  - Contains both admin dashboard and customer website in a single Next.js application
  - Admin dashboard accessible at: https://multiprints-staging.vercel.app/admin
  - Customer website accessible at: https://multiprints-staging.vercel.app

## Deployment

The staging environment is automatically deployed when changes are pushed to the `develop` branch.

## Access

- **Admin Dashboard**: https://multiprints-staging.vercel.app/admin
  - Username: admin@multiprints.com
  - Password: [Contact administrator]

- **Customer Website**: https://multiprints-staging.vercel.app

## Testing

Before deploying to production, all changes should be thoroughly tested in the staging environment:

1. Functional testing
2. Performance testing
3. Security testing
4. User acceptance testing

## Limitations

- The staging environment uses free tiers with some limitations:
  - Render free tier may sleep after inactivity
  - PostgreSQL free trial lasts 90 days
  - Limited resources compared to production

## Monitoring

- Sentry: https://sentry.io/organizations/multiprints/issues/?project=staging
- UptimeRobot: https://uptimerobot.com/dashboard#mainDashboard

## Setup Instructions

### Render Backend Setup

1. Sign up for Render at [render.com](https://render.com/)
2. Create a new Web Service:
   - Connect your GitHub repository
   - Name: `multiprints-backend-staging`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Plan: Free

3. Configure environment variables:
   - `FLASK_ENV`: `staging`
   - `SECRET_KEY`: [Secure random string]
   - `DATABASE_URL`: [From Render PostgreSQL]
   - `CLOUDINARY_CLOUD_NAME`: [Your Cloudinary cloud name]
   - `CLOUDINARY_API_KEY`: [Your Cloudinary API key]
   - `CLOUDINARY_API_SECRET`: [Your Cloudinary API secret]

### Render PostgreSQL Setup

1. Create a new PostgreSQL database:
   - Name: `multiprints-staging-db`
   - Database: `multiprints_staging`
   - Plan: Free

2. Connect to your backend service:
   - Copy the Internal Database URL
   - Add as `DATABASE_URL` environment variable in your backend service

### Vercel Frontend Setup

1. Sign up for Vercel at [vercel.com](https://vercel.com/)
2. Import your GitHub repository
3. Configure unified frontend:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Environment Variables:
     - `NEXT_PUBLIC_API_URL`: [Your Render backend URL + `/api/v1`]
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: [Your Cloudinary cloud name]

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Create an upload preset for staging:
   - Name: `multiprints_staging`
   - Signing Mode: `Signed`
   - Folder: `staging`

### GitHub Actions Setup

1. Add required secrets to your GitHub repository:
   - `RENDER_API_KEY`
   - `RENDER_BACKEND_SERVICE_ID`
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_ADMIN_PROJECT_ID`
   - `VERCEL_CUSTOMER_PROJECT_ID`

2. Create a GitHub Environment named `staging`