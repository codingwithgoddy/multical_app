# Multiprints Frontend

This is the frontend application for the Multiprints Business Management System.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   Then edit the `.env.local` file to add your configuration.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- `/`: Home page / Customer website
- `/admin`: Admin dashboard

## Development

- Add new pages in the `pages` directory
- Add reusable components in the `components` directory
- Add styles in the `styles` directory

## Building for Production

```bash
npm run build
npm start
```