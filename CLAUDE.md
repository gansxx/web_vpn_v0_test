# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VPN service web application called "Z加速" (Z-Acceleration) built with Next.js 15 and React 19. The application provides a marketing landing page and a user dashboard for managing VPN subscriptions, with authentication middleware protecting dashboard routes.

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm run lint` - Run ESLint
- `npm run start` - Start production server

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components using Radix UI primitives and shadcn/ui patterns
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Authentication**: Cookie-based session management

## Project Structure

### Key Directories
- `app/` - Next.js App Router pages
- `components/` - Reusable UI components
- `lib/` - Utility functions and configuration
- `public/` - Static assets

### Page Routes
- `/` - Marketing landing page (public)
- `/signin` - Sign-in page (public)
- `/register` - Registration page (public)
- `/dashboard` - User dashboard (protected by middleware)
- `/recall` - Password reset page (public)

### Key Configuration Files
- `middleware.ts` - Route protection logic
- `lib/config.ts` - API base URL configuration
- `lib/plans.ts` - Subscription plan definitions
- `lib/utils.ts` - Shared utility functions

## Architecture

### Authentication Flow
- Uses cookie-based authentication with `access_token`
- Middleware protects `/dashboard/*` routes
- Redirects to `/signin` for unauthenticated users
- Public paths: `/`, `/signin`, `/register`, `/recall`, `/api/*`, `/_next/*`

### API Integration
- Backend API base URL configurable via `NEXT_PUBLIC_API_BASE` environment variable
- Uses `credentials: "include"` for cookie-based sessions
- User management endpoints: `/user/products`, `/user/orders`, `/user/free-plan/purchase`

### UI Components
- Built with Tailwind CSS and custom component library
- Uses Radix UI primitives for accessibility
- Follows shadcn/ui patterns for consistent styling
- Theme support with dark/light modes

### State Management
- Client-side React state (useState, useEffect)
- No global state management library
- Server components where possible

### Data Models
- **Plans**: Defined in `lib/plans.ts` with type-safe plan configurations
- **User Products**: `{product_name, subscription_url, email, phone, buy_time, end_time}`
- **Orders**: Flexible mapping from various backend fields to consistent display format

## Development Notes

### Environment Variables
- `NEXT_PUBLIC_API_BASE` - Backend API URL (defaults to "https://selfgo.asia/api")

### Styling Conventions
- Use Tailwind utility classes
- Component styling follows established patterns in `/components/ui/`
- Responsive design with mobile-first approach
- Dark mode support via CSS variables

### Code Patterns
- Functional components with TypeScript
- Custom hooks for data fetching
- Error boundaries and loading states
- Server components for static content
- Client components for interactivity

### Key Features
- Multi-platform VPN service marketing site
- User dashboard with subscription management
- Order history tracking
- Real-time product status updates
- Responsive design across all screen sizes
- Chinese language interface with "Z加速" branding