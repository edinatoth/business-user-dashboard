# Business User Dashboard

Enterprise-style React + TypeScript application built to demonstrate modern frontend architecture and AI integration patterns.

## Features

- React 19 + TypeScript
- RTK Query for data fetching and cache management
- Feature-based folder structure
- Custom reusable hooks
- AI-powered user analytics using Claude API
- User search with debouncing
- Role and status filtering
- Confirmation modal workflow
- Reusable UI components
- Responsive dashboard layout

## Architecture

src/
├── app/
├── features/
│ └── users/
│ ├── api/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ └── types/
└── shared/
├── hooks/
└── components/

## AI Integration

The application includes a Node.js backend that integrates with Anthropic Claude.

Users can generate AI summaries from the currently filtered user list, including:

- Active vs inactive user statistics
- Role distribution
- Administrative recommendations
- User management insights

## Tech Stack

Frontend:
- React
- TypeScript
- RTK Query
- Vite

Backend:
- Node.js
- Express
- Anthropic Claude API

## Future Improvements

- Authentication
- User editing
- AI chat assistant
- Dashboard analytics
- Unit tests with Vitest
- E2E testing with Playwright
