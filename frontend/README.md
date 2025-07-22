# MultiPrints Admin Dashboard

This is the admin dashboard for the MultiPrints Business Management System. It provides a comprehensive interface for managing products, orders, customers, and payments for printing businesses.

## Features

- Product management with image uploads via Cloudinary
- Order tracking and management
- Customer management and debt tracking
- Payment processing with Mpesa integration
- Business analytics and reporting
- Multi-admin collaboration with role-based access

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS for styling
- React Hook Form for form handling
- SWR for data fetching
- Zustand for state management
- Headless UI for accessible components
- Heroicons for icons

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd frontend
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration values.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
# or
yarn build
```

### Start Production Server

Start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `components/` - React components
  - `layout/` - Layout components
  - `ui/` - Reusable UI components
- `hooks/` - Custom React hooks
- `pages/` - Next.js pages
- `public/` - Static assets
- `styles/` - Global styles
- `types/` - TypeScript type definitions
- `utils/` - Utility functions

## API Integration

The dashboard connects to the Flask backend API. API configuration is managed through environment variables:

- `NEXT_PUBLIC_API_URL` - Base URL for the API
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for file uploads
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset

### Testing API Integration

The dashboard includes tools to test the API integration:

1. **API Status Component**: The dashboard includes an API status component that shows the current connection status to the backend API. This component is visible on the dashboard page.

2. **API Test Page**: A dedicated API test page is available at `/api-test` that allows you to test various API endpoints directly from the browser. This page includes:
   - A dropdown to select different API endpoints
   - A text area to input request bodies for POST requests
   - A response display area to view API responses
   - Authentication status tracking

3. **API Testing Utilities**: The `utils/api-test.ts` file includes utility functions for testing API connectivity and authentication.

To test the API integration:

1. Make sure the backend server is running:
   ```bash
   cd backend
   python run.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to the dashboard at [http://localhost:3000](http://localhost:3000) and check the API status component.

4. Navigate to the API test page at [http://localhost:3000/api-test](http://localhost:3000/api-test) to test specific API endpoints.

## Authentication

The dashboard uses JWT authentication with the backend API. Authentication state is managed through the `useAuth` hook.

## Deployment

The application can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or AWS Amplify.

## License

This project is proprietary and confidential.