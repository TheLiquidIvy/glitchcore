# Glitchcore Project

## Overview
Glitchcore is a full-stack cyberpunk ecommerce application with React frontend and Express backend.

**Status**: ✅ Running and operational

## Architecture

### Frontend
- **Framework**: React 18.3.1 with react-scripts
- **Port**: 5000 (Replit webview)
- **Location**: `/client`
- **Features**: Ecommerce store with cyberpunk theme

### Backend
- **Framework**: Express.js 4.19.2
- **Port**: 3001
- **Location**: `/server`
- **Database**: SQLite with Sequelize ORM
- **Features**: 
  - User authentication with JWT
  - User profiles and subscriptions
  - Blog system
  - Forum (categories, topics, posts)
  - Pod drafts manager
  - Stripe integration

### Database
- **Type**: SQLite
- **Location**: `server/database.sqlite`
- **Models**: User, Order, PodDraft, Recommendation, Image, BlogPost, ForumCategory, Topic, Post

## Running the Application

The application is configured with a single workflow that runs the React frontend on port 5000.
The backend runs on port 3001 and is proxied through the frontend as configured in `client/package.json`.

### Project Structure
```
.
├── client/              # React frontend
│   ├── public/         # Static assets
│   ├── src/            # React components
│   └── package.json
├── server/             # Express backend
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth middleware
│   ├── models.js       # Sequelize models
│   ├── config.js       # Configuration
│   └── package.json
└── public/             # Static files (HTML, CSS, JS)
```

## Configuration

### Environment Variables
- `JWT_SECRET`: JWT signing secret (default: 'your_jwt_secret')
- `PORT`: Backend port (default: 3001)
- `STRIPE_SECRET_KEY`: Stripe API key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

### Frontend Configuration
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Allows Replit proxy
- `PORT=5000` - Runs on Replit webview port
- `proxy: http://localhost:3001` - Backend proxy in package.json

## Recent Changes
- Fixed server/package.json syntax errors
- Fixed server/server.js structure and imports
- Reconstructed server/models.js with all model definitions
- Set up client/public directory with necessary index.html
- Configured workflow for React development server on port 5000

## Known Issues
- Snipcart integration has configuration errors (missing API key)
- Some 500 errors in frontend (likely due to missing Stripe/Snipcart configuration)

## Next Steps
- Configure environment variables for Stripe and Snipcart
- Fix database synchronization issues
- Implement proper error handling
- Deploy to production when ready
