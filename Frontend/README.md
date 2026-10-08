# Open LMS – Frontend

A modern, responsive Learning Management System (LMS) web application built using React 18, Vite, and Tailwind CSS.

## Features

- **Role-Based Workspaces**:
  - **Student Portal**: Dashboard with course progress, upcoming deadlines, class schedules, interactive quizzes, assignments, and calendar view.
  - **Instructor Portal**: Teaching overview, course management, submissions review, inline document grading with rubrics, and gradebook.
- **Modern UI & UX**: Clean, accessible design system with responsive layouts, dark navigation sidebar, interactive status badges, and progress rings.
- **State Management & Routing**: Managed via React Router v6, Zustand for client state, and TanStack Query for server state.
- **REST API Integration Layer**: Modular HTTP service layer built with Axios, ready for Spring Boot backend integration with fallback mock support.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand, TanStack Query
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Project Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
The application will start on `http://localhost:5173` (or `http://localhost:5174`).

### Building for Production
```bash
npm run build
```

## Folder Structure

```
Frontend/
├── public/              # Static assets & icons
├── src/
│   ├── app/             # Application router & providers
│   ├── components/
│   │   ├── layout/      # App layouts, Sidebar, Topbar
│   │   └── ui/          # Core design system primitives (Button, Input, Card, Modal, etc.)
│   ├── features/
│   │   ├── auth/        # Login and registration flows
│   │   ├── landing/     # Landing and role selection pages
│   │   ├── student/     # Student dashboard, courses, assignments, quiz taking
│   │   ├── professor/   # Instructor dashboard, courses, grading, gradebook
│   │   └── messages/    # Messages and discussions
│   ├── lib/             # HTTP client and utility functions
│   ├── mocks/           # Mock fixtures for standalone frontend testing
│   ├── store/           # Zustand state stores
│   └── styles/          # Global styles & Tailwind configuration
├── package.json
├── tailwind.config.js
└── vite.config.js
```
