# Financial Portfolio Tracker

A web application for tracking investment portfolios, trades, and performance metrics.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-tracker.git
   cd portfolio-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

4. **Set up the database schema**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Architecture & Approach

This application uses a modern full-stack approach built on Next.js 14 with the App Router. The frontend is developed with React and styled using Tailwind CSS with shadcn/ui components for a clean, responsive interface. For data persistence, we use PostgreSQL running in Docker with Prisma as the ORM to handle database operations. API routes in Next.js handle CRUD operations for portfolios and trades, while client-side components manage state with React hooks. Performance visualization is implemented using Recharts for interactive charts.

The architecture follows a modular design with clean separation of concerns: database models for data structure, API routes for server operations, UI components for presentation, and utility functions for shared logic. This approach allows for easy maintenance and scalability as the application grows.