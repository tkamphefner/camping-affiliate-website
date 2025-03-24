# Camping Affiliate Website - Backend Setup

This directory contains the backend implementation for the Camping Affiliate Website.

## Structure

- `server.js`: Main Express server file with API endpoints
- `data/`: Directory for storing JSON data files
  - `products.json`: Product catalog with Amazon affiliate links
  - `contacts.json`: Contact form submissions (created at runtime)
  - `subscriptions.json`: Newsletter subscriptions (created at runtime)
  - `affiliate_clicks.json`: Affiliate link click tracking (created at runtime)

## API Endpoints

- `/api/contact`: Handles contact form submissions
- `/api/newsletter`: Processes newsletter signups
- `/api/track-affiliate`: Tracks affiliate link clicks
- `/api/products`: Retrieves product data, with optional category filtering

## Setup Instructions

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```

3. For development with auto-restart:
```
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
PORT=3000
```

## Notes

- The backend currently stores data in JSON files for simplicity
- In a production environment, you would use a database instead
- Email functionality is currently mocked but can be implemented with nodemailer
