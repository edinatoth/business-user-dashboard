# Business User Dashboard

Enterprise-style React + TypeScript application built to demonstrate modern frontend architecture and AI integration patterns.

## Features

* React 19 + TypeScript
* RTK Query for data fetching and caching
* Feature-based architecture
* Reusable UI components
* Custom React Hooks
* AI-powered user analytics using Claude API
* Search with debouncing
* Role and status filtering
* Confirmation modal workflow
* Responsive dashboard layout
* Unit tested business logic

---

## Architecture

```text
src/
├── app/
├── features/
│   └── users/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── types/
├── shared/
│   ├── components/
│   └── hooks/
```

The project follows a feature-based architecture where functionality is grouped by business domain instead of technical layer. This improves scalability and maintainability for larger applications.

---

## AI Integration

The application contains a Node.js backend which integrates with Anthropic Claude.

The frontend sends the currently filtered users to the backend API.

The backend:

* Protects the Claude API key
* Creates AI prompts
* Validates responses
* Returns structured JSON data

Generated insights include:

* Active vs inactive users
* Role distribution
* Potential risks
* Administrative recommendations
* User management observations

---

## Technical Decisions

### Why Feature-Based Architecture?

Instead of organizing files by type (components, hooks, services globally), features are grouped by business domain.

Benefits:

* Better scalability
* Easier onboarding
* Clear ownership boundaries
* Reduced coupling between modules

This approach is commonly used in enterprise React applications.

---

### Why RTK Query?

RTK Query was selected instead of manual fetch calls because it provides:

* Automatic caching
* Request deduplication
* Loading states
* Error handling
* Cache invalidation

This reduces boilerplate and keeps data management predictable.

---

### Why Custom Hooks?

Business logic is extracted into reusable hooks such as:

```ts
useAiUserSummary()
```

Benefits:

* Separation of concerns
* Improved testability
* Reusable logic
* Cleaner UI components

Components focus on presentation while hooks handle behavior.

---

### Why Backend Proxy For AI?

The frontend never communicates directly with Claude.

Instead:

```text
React Frontend
      ↓
Node.js Backend
      ↓
Claude API
```

Benefits:

* API keys remain secure
* Prompt engineering stays server-side
* Easier monitoring and logging
* Centralized AI integrations

This mirrors production-grade architecture.

---

### Why Structured AI Responses Instead of Plain Text?

Initially the AI returned free-text summaries.

The application was upgraded to return structured JSON responses.

Benefits:

* Predictable rendering
* Strong TypeScript typing
* Better UI presentation
* Easier future integrations
* More reliable parsing

Example:

```json
{
  "overview": "...",
  "riskLevel": "Medium",
  "stats": {},
  "recommendations": []
}
```

This approach is significantly more robust than rendering raw AI-generated text.

---

## Tech Stack

### Frontend

* React
* TypeScript
* RTK Query
* Vite

### Backend

* Node.js
* Express
* Anthropic Claude API

---

## Security

* Claude API keys are stored in environment variables
* API keys are never exposed to the frontend
* `.env` files are excluded from source control

---

## Running The Project

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

## Future Improvements

* Authentication and authorization
* AI-powered anomaly detection
* Dashboard charts and analytics
* Audit logs
* CI/CD pipeline
* Docker support
* End-to-end testing
