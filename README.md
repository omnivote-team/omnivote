# OmniVote

OmniVote is a full-stack web-based election management system designed for universities, departments, student societies, and organizational elections. The platform provides a secure and structured environment for managing the complete election lifecycle, from election creation and candidate applications to voting and result publication.

The system is built with a React frontend and a FastAPI backend following a service-oriented architecture with PostgreSQL as the database layer.

---

# Project Goals

OmniVote aims to modernize traditional election workflows by providing:

* Secure authentication and authorization
* Role-based access control for admins and voters
* Eligibility-based election participation
* Transparent candidate management
* Real-time election status handling
* Automated result generation and publication
* Clean and user-friendly interfaces for both voters and administrators

---

# Key Features

## Authentication & Authorization

* Secure login and signup system
* JWT-based authentication
* Role-based access control for admins and users
* Protected admin-only routes and actions

## Election Management

* Create, edit, and delete elections
* Time-based election lifecycle (`upcoming`, `open`, `closed`)
* Institution, department, batch, and section-based election targeting
* Dynamic election filtering and search

## Candidate Application System

* Candidate application submission
* Eligibility validation before application
* Admin approval and rejection workflow
* Candidate management per election

## Voting System

* Eligibility-based voting access
* Secure one-vote-per-user enforcement
* Ongoing election participation
* Voting history tracking for users

## Results Management

* Automatic vote counting
* Winner calculation
* Controlled result publication system
* Election result visibility management

## Admin Dashboard

* Election analytics and summaries
* Pending application monitoring
* Election statistics and management tools

## Audit & System Integrity

* Permission validation on protected actions
* Eligibility enforcement across workflows
* Backend-driven business logic validation

---

# Technology Stack

## Frontend

* React
* React Router
* Axios
* CSS

## Backend

* FastAPI
* SQLAlchemy ORM
* PostgreSQL
* Pydantic
* JWT Authentication

---

# Project Structure

```text
omnivote/
├── frontend/
│   ├── src/
│   │   ├── api/                    # API request handlers and Axios configuration
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Application pages and route views
│   │   ├── data/                   # Mock/development data
│   │   ├── styles/                 # Shared styling files
│   │   ├── App.jsx                 # Main routing configuration
│   │   ├── App.css                 # Global application styles
│   │   └── main.jsx                # React application entry point
│   │
│   └── public/
│
├── backend/
│   ├── models/                     # SQLAlchemy database models
│   ├── routers/                    # FastAPI route definitions
│   ├── services/                   # Business logic and authorization logic
│   ├── schemas/                    # Pydantic request/response schemas
│   ├── database/                   # Database configuration and session setup
│   ├── utils/                      # Helper utilities and reusable functions
│   ├── migrations/                 # Database migrations
│   ├── main.py                     # FastAPI application entry point
│   └── requirements.txt            # Backend dependencies
│
├── docs/
│   ├── class-diagram/              # Analysis and design class diagrams
│   ├── use-cases/                  # Use case diagrams and descriptions
│   ├── activity-diagrams/          # Activity diagrams
│   ├── sequence-diagrams/          # Sequence diagrams
│   └── state-diagrams/             # State diagrams
│
└── README.md
```

---

# Frontend Architecture

## components/

Contains reusable UI elements shared across the application.

Examples:

* Navigation bars
* Election cards
* Filters
* Dashboard widgets
* Empty state components

## pages/

Contains full route-based pages for the application.

Examples:

* Login page
* Signup page
* User dashboard
* Admin dashboard
* Election details pages
* Voting pages

## api/

Handles API communication between the frontend and backend using Axios.

## data/

Contains temporary mock data used during early-stage frontend development.

---

# Backend Architecture

The backend follows a layered architecture to keep the application modular and maintainable.

## routers/

Defines API endpoints and request handling.

Examples:

* Authentication routes
* Election routes
* Voting routes
* Candidate application routes

## services/

Contains the core business logic of the application.

Examples:

* Eligibility validation
* Authorization checks
* Vote handling
* Result generation
* Election status computation

## models/

Defines SQLAlchemy database models and relationships.

## schemas/

Defines Pydantic schemas used for request validation and API responses.

## database/

Handles database connection setup and session management.

---

# Design Principles

OmniVote follows several software engineering and architectural principles:

* Separation of concerns
* Reusable component design
* Service-based backend architecture
* Backend-driven business validation
* Role-based authorization
* Eligibility-based access control
* Modular and scalable project structure

---

# Election Workflow

1. Admin creates an election
2. Eligible users apply as candidates
3. Admin reviews and approves applications
4. Election automatically opens based on scheduled time
5. Eligible voters cast votes
6. Election closes automatically
7. Results are generated and published by admin

---

# Security & Validation

* JWT authentication for protected routes
* Backend validation for all sensitive actions
* Eligibility checks before voting or applying
* Admin-only access for management operations
* Protected result visibility

---

# Future Improvements

* Real-time notifications
* Email verification
* Multi-factor authentication
* Advanced analytics dashboard
* Live election statistics
* Mobile responsive optimization
* Audit log visualization

---

# Authors

Developed as part of a software engineering project focused on building a scalable and maintainable election management platform.
