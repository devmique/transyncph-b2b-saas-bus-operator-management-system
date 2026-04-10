# TranSync PH - Bus Operator Management System

A modern SaaS platform for Philippine bus operators to streamline route management, scheduling, and passenger communication.

## Features

### For Bus Operators (Dashboard)
- **Route Management**: Create and manage bus routes with detailed stops and estimated times
- **Schedule Management**: Assign drivers and vehicles to routes with flexible scheduling
- **Terminal Management**: Register and organize terminal locations with GPS coordinates
- **Announcements**: Broadcast service updates and delays to commuters
- **Analytics Dashboard**: Monitor operational metrics and performance

### For Commuters (Public Map)
- **Route Finder**: Search and discover bus routes by route number, start point, or destination
- **Terminal Locator**: Find nearby terminals and get location information
- **Service Visibility**: View available routes and key operational details

## Technology Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt password hashing
- **Styling**: Tailwind CSS v4 with semantic design tokens

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- MongoDB instance (MongoDB Atlas recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd v0-project
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=
```

4. Run the development server:
```bash
pnpm dev
```

Visit http://localhost:3000 to see the application.


## User Flows

### Operator Registration & Dashboard Access
1. Visit `/register` to create account
2. After login, access `/dashboard` for overview
3. Navigate to Routes, Schedules, Terminals, or Announcements from sidebar
4. Manage operations through intuitive forms and lists

### Commuter Route Discovery
1. Visit `/map` page for public route finder
2. Search by route number, starting point, or destination
3. View available terminals and route details
4. Register button to encourage operator sign-ups

## Database Schema

### Collections
- **operators**: Company information and authentication
- **routes**: Route definitions with stops and times
- **schedules**: Driver assignments and route schedules
- **terminals**: Pickup/dropoff locations with GPS data
- **announcements**: Service updates and alerts

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes with token verification
- MongoDB ObjectID validation
- Input validation with Zod

## Performance Optimizations

- Server-side rendering for public pages
- Client-side data fetching with caching
- Optimized database queries with indexes
- CSS-in-JS with Tailwind for minimal bundle size


## Future Enhancements

- Real-time GPS tracking for buses
- SMS notifications for commuters
- Payment integration for ticketing
- Analytics dashboard for route optimization
- Mobile app for drivers and commuters
- Integration with Google Maps for routing
- Multi-language support (Filipino, English)

## Support

For issues or questions, please open a GitHub issue 

## License

© 2026 TranSync PH. All rights reserved.
