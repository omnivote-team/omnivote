# OmniVote

OmniVote is a web-based election management system for university, department, and society elections. It is designed to digitize and simplify the election process through a structured platform for managing users, candidates, ballots, votes, and results.

## Project Overview

The purpose of OmniVote is to provide a secure, organized, and easy-to-use system for conducting elections in academic and organizational environments. The project covers core election workflows, from election setup and candidate management to voting and result publication.

## Core Features

- Authentication and access control
- Election setup and administration
- Candidate application and approval
- Voter eligibility management
- Ballot generation and vote submission
- Result computation and publication
- System activity tracking and audit logging     

## Repository Structure

```text
omnivote/
├── frontend/                 # React-based user interface
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Application pages (routes)
│       ├── data/            # Mock data for development
│       ├── App.jsx          # Routing configuration
│       ├── App.css          # Global styles for the app
│       └── main.jsx         # Entry point
│
│
└── docs/
    ├── class-diagram/       # Analysis and design class diagrams
    └── use-cases/           # Use case diagram, descriptions, activity, sequence, and state diagrams

### Folder Explanation

- **components/**  
  Contains reusable UI elements used across multiple pages (e.g., Navbar, Cards, Filters).

- **pages/**  
  Contains full pages that represent routes in the app (e.g., Login, Dashboard, Profile).

- **data/**  
  Stores mock data used during development before backend integration.

- **App.jsx**  
  Handles routing between different pages using React Router.

- **main.jsx**  
  Entry point of the React application.

---

### Design Approach

- Reusable UI is kept in **components**
- Page-level logic is kept in **pages**
- Data is separated into **data files**
- Logged-in and logged-out views are handled using different pages (e.g., `ElectionListPage` vs `UserElectionListPage`)
- Page-specific CSS files are kept alongside their respective components/pages
