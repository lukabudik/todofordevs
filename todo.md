# TodoForDevs - Development Checklist

This document outlines the detailed development plan for the TodoForDevs MVP, organized into phases and actionable tasks. Each task includes context and details to guide implementation.

## Phase 0: Project Initialization & Foundational Setup

### Task 0.1: Verify & Finalize Next.js Project Setup

- [x] **0.1.1: Confirm Next.js (React, TypeScript) is correctly initialized**
  - Verify that the Next.js project structure follows best practices
  - Ensure TypeScript is properly configured with appropriate tsconfig settings
  - Check that the project uses the App Router structure (src/app)
- [x] **0.1.2: Ensure `src/` directory structure is as intended**
  - Verify the organization of components, hooks, utils, and other directories
  - Create any missing directories needed for the project architecture
  - Ensure the structure supports good separation of concerns

### Task 0.2: Configure Linters & Formatters

- [x] **0.2.1: Verify ESLint (`eslint.config.mjs`) is set up for consistent code quality**
  - Ensure ESLint is configured with appropriate rules for React and TypeScript
  - Configure rules that enforce clean code practices
- [x] **0.2.2: Set up Prettier for consistent formatting**
  - Configure Prettier to work alongside ESLint
  - Set up appropriate formatting rules (indentation, quotes, etc.)
- [x] **0.2.3: Add any project-specific rules if necessary**
  - Consider adding rules specific to the project's needs
  - Ensure rules align with the project's coding standards

### Task 0.3: Install Core Dependencies

- [x] **0.3.1: Install Prisma ORM**
  - `pnpm install prisma @prisma/client`
  - This will be used for database interactions and schema management
- [x] **0.3.2: Install Auth.js (NextAuth)**
  - `pnpm install next-auth`
  - This will handle authentication for the application
- [x] **0.3.3: Install Tailwind CSS and related packages**
  - `pnpm install tailwindcss postcss autoprefixer`
  - This will be used for styling the application
- [x] **0.3.4: Install Shadcn UI prerequisites**
  - `pnpm install class-variance-authority clsx lucide-react tailwind-merge`
  - These are required for Shadcn UI components
- [x] **0.3.5: Initialize Shadcn UI**
  - `pnpm dlx shadcn-ui@latest init`
  - Configure with project preferences (typography, colors, etc.)
  - This will set up the component library infrastructure

### Task 0.4: Setup Prisma ORM with PostgreSQL

- [x] **0.4.1: Initialize Prisma**
  - `pnpm prisma init --datasource-provider postgresql`
  - This creates the initial Prisma configuration
- [x] **0.4.2: Define initial Prisma schema (`prisma/schema.prisma`)**
  - Create `User` model with fields:
    - id, name, email, password (hashed), emailVerified, image, accounts, sessions, projects, assignedTasks
  - Create `Project` model with fields:
    - id, name, ownerId, owner (relation), tasks (relation), collaborators (relation)
  - Create `Task` model with fields:
    - id, title, description, status, priority, dueDate, createdAt, updatedAt, projectId, project (relation), assigneeId, assignee (relation)
  - Create `ProjectUser` join table with fields:
    - projectId, userId, role (e.g., 'OWNER', 'COLLABORATOR')
  - Include Auth.js models: `Account`, `Session`, `VerificationToken` (as per NextAuth.js Prisma adapter docs)
- [x] **0.4.3: Configure database connection string in `.env`**
  - Set up the DATABASE_URL environment variable
  - Ensure it points to a valid PostgreSQL instance
- [x] **0.4.4: Create initial migration**
  - `pnpm prisma migrate dev --name initial-setup`
  - This will create the database schema based on the Prisma models

### Task 0.5: Setup Auth.js (NextAuth.js)

- [x] **0.5.1: Configure Auth.js with Prisma adapter**
  - Create `src/app/api/auth/[...nextauth]/route.ts`
  - Set up the Prisma adapter for Auth.js
  - Configure session strategy (JWT or database)
- [x] **0.5.2: Define authentication providers**
  - Set up Email/Password provider initially
  - (GitHub OAuth will be added later as a stretch goal)
- [x] **0.5.3: Set up required environment variables**
  - Configure `AUTH_SECRET` for session encryption
  - Set up `DATABASE_URL` for the Prisma adapter
  - Add any other required variables for the chosen providers

### Task 0.6: Setup Tailwind CSS & Shadcn UI

- [x] **0.6.1: Configure Tailwind CSS**
  - Set up `tailwind.config.ts` with appropriate theme settings
  - Configure `postcss.config.mjs` for processing
- [x] **0.6.2: Integrate Tailwind into `src/app/globals.css`**
  - Add the Tailwind directives (@tailwind base, components, utilities)
  - Include any global styles needed for the application
- [x] **0.6.3: Define basic layout components using Shadcn UI**
  - Create `MainLayout` component for the application's main structure
  - Implement `Navbar` component for navigation
  - Create `Sidebar` component for project navigation
  - Install and configure necessary Shadcn components:
    - Button, Card, Input, Dialog, DropdownMenu, etc.

### Task 0.7: Implement Light & Dark Mode Theme Toggle

- [x] **0.7.1: Set up theme provider**
  - Install and configure `next-themes` or use Tailwind's dark mode variant
  - Set up theme context/provider in the application
- [x] **0.7.2: Create theme toggle UI element**
  - Add a button in the Navbar to toggle between light and dark themes
  - Implement appropriate icons for each theme state
- [x] **0.7.3: Ensure theme compatibility with Shadcn components**
  - Verify that all Shadcn components respect the selected theme
  - Test theme switching to ensure consistent appearance

## Phase 1: Core Task Management Features (Backend & Frontend)

### Task 1.1: Project Management (Backend - API Routes / Route Handlers)

- [x] **1.1.1: Implement Create Project API**
  - Create `POST /api/projects` endpoint
  - Require authentication
  - Accept project name in request body
  - Set current user as owner
  - Return created project data
- [x] **1.1.2: Implement Get Projects for User API**
  - Create `GET /api/projects` endpoint
  - Require authentication
  - Return projects owned by or collaborated on by the current user
  - Include basic project details (id, name, owner)
- [x] **1.1.3: Implement Get Single Project Details API**
  - Create `GET /api/projects/[projectId]` endpoint
  - Require authentication and project membership
  - Return detailed project information including tasks
  - Include error handling for unauthorized access
- [x] **1.1.4: Implement Rename Project API**
  - Create `PUT /api/projects/[projectId]` endpoint
  - Require authentication and project ownership
  - Accept new name in request body
  - Return updated project data
- [x] **1.1.5: Implement Delete Project API**
  - Create `DELETE /api/projects/[projectId]` endpoint
  - Require authentication and project ownership
  - Handle cascading deletes of tasks or implement soft deletes
  - Return success status

### Task 1.2: Project Management (Frontend - UI Components)

- [x] **1.2.1: Create Projects List UI**
  - Implement component to display user's projects in sidebar
  - Fetch projects data from API
  - Show project names with visual indicators for ownership
  - Handle loading and error states
- [x] **1.2.2: Create New Project Form/Modal**
  - Implement Shadcn Dialog component for creating new projects
  - Include form with project name input
  - Add validation for required fields
  - Connect to Create Project API
  - Show success/error feedback
- [x] **1.2.3: Implement Project Options UI**
  - Add Shadcn DropdownMenu to each project item
  - Include options to rename and delete projects
  - Implement confirmation dialog for delete action
  - Connect to respective APIs

### Task 1.3: Task Management (Backend - API Routes / Route Handlers)

- [x] **1.3.1: Implement Create Task API**
  - Create `POST /api/projects/[projectId]/tasks` endpoint
  - Require authentication and project membership
  - Accept task details: title, description, status, priority, dueDate
  - Return created task data
- [x] **1.3.2: Implement Get Tasks for Project API**
  - Create `GET /api/projects/[projectId]/tasks` endpoint
  - Require authentication and project membership
  - Include query parameters for sorting and filtering
  - Return tasks with all relevant details
- [x] **1.3.3: Implement Update Task API**
  - Create `PUT /api/tasks/[taskId]` endpoint
  - Require authentication and project membership
  - Accept updates to any task attribute
  - Return updated task data
- [x] **1.3.4: Implement Delete Task API**
  - Create `DELETE /api/tasks/[taskId]` endpoint
  - Require authentication and project membership
  - Return success status
- [x] **1.3.5: Implement Backend Logic for Sorting Tasks**
  - Add support for sorting by due date, priority, creation date, status
  - Implement efficient database queries for each sort option
  - Ensure consistent sorting behavior
- [x] **1.3.6: Implement Backend Logic for Filtering Tasks**
  - Add support for filtering by status, priority, assignee
  - Implement efficient database queries for each filter option
  - Allow combining multiple filters

### Task 1.4: Task Management (Frontend - UI Components)

- [x] **1.4.1: Create Tasks View UI**
  - Implement main view to display tasks within a selected project
  - Consider using Shadcn Table or custom cards for task display
  - Show task title, status, priority, due date, and assignee
  - Handle loading and empty states
- [x] **1.4.2: Create Task Form/Modal**
  - Implement Shadcn Dialog and Form for creating/editing tasks
  - Include fields for all task attributes:
    - Title input (Shadcn Input)
    - Description textarea (for Markdown, to be enhanced in Phase 2)
    - Status select (Shadcn Select - "To Do", "In Progress", "Blocked", "Done")
    - Priority select (Shadcn Select - "Low", "Medium", "High", "Urgent")
    - Due Date picker (Shadcn DatePicker)
  - Add validation for required fields
  - Connect to Create/Update Task APIs
- [x] **1.4.3: Implement Priority Visual Indicators**
  - Create colored dots/tags to indicate task priority
  - Ensure colors are accessible and distinguishable
  - Apply consistent styling across the application
- [x] **1.4.4: Implement Task Options UI**
  - Add options to each task item for edit/delete actions
  - Implement confirmation dialog for delete action
  - Connect to respective APIs
- [x] **1.4.5: Implement Task Sorting Controls**
  - Create UI controls (dropdowns) for sorting tasks
  - Connect to the backend sorting functionality
  - Provide visual feedback for the current sort option
- [x] **1.4.6: Implement Task Filtering Controls**
  - Create UI controls for filtering tasks by status, priority, assignee
  - Connect to the backend filtering functionality
  - Allow combining multiple filters
  - Provide visual feedback for active filters
- [x] **1.4.7: Implement Task Status Change UI**
  - Create an easy way to change task status
  - Implement status change through task edit form
  - Connect to Update Task API

## Phase 2: Developer-Specific Features (MVP)

### Task 2.1: Markdown Editor & Renderer for Task Descriptions

- [x] **2.1.1: Integrate Markdown Editor Component**
  - Research and select a Markdown editor component
  - Selected `react-markdown` with `remark-gfm` for GitHub Flavored Markdown support
  - Install and configure the chosen component
- [x] **2.1.2: Implement Markdown Preview**
  - Add live preview or toggle for rendered Markdown
  - Ensure the preview accurately reflects the final rendering
  - Make the preview/edit toggle intuitive
- [x] **2.1.3: Ensure Full GitHub Flavored Markdown Support**
  - Verify support for tables, task lists, inline code, and fenced code blocks
  - Test with various Markdown syntax to ensure compatibility
  - Fix any rendering issues

### Task 2.2: Syntax Highlighting in Rendered Markdown

- [x] **2.2.1: Integrate Syntax Highlighting Library**
  - Research and select a syntax highlighting library
  - Selected `rehype-highlight` with `highlight.js` for syntax highlighting
  - Install and configure the chosen library
- [x] **2.2.2: Implement Automatic Language Detection**
  - Ensure code blocks with language specifiers are properly highlighted
  - Test with various programming languages
  - Implement fallback for unspecified languages

### Task 2.3: Keyboard Shortcuts (Essential Set) (let's not do this now - it's pretty hard)

- [ ] **2.3.1: Set Up Keyboard Shortcut Library**
  - Research and select a library for handling keyboard shortcuts
  - Options include `hotkeys-js` or similar
  - Install and configure the chosen library
- [ ] **2.3.2: Implement Global Quick Add Shortcut**
  - Create shortcut to open Quick Add Task modal/bar
  - Ensure it works globally within the application
  - Add visual indicator or help text to inform users
- [ ] **2.3.3: Implement In-App Shortcuts**
  - New Task (e.g., `N`)
  - Save Task (e.g., `Ctrl+S` or `Cmd+S` in forms)
  - Close/Cancel (e.g., `Esc` for modals)
  - Edit Task (e.g., `E` when a task is focused/selected)
  - Mark as Done (e.g., `D` or `Space` when task focused)
  - Cycle Status (e.g., `S` to cycle through statuses)
  - Assign Priority Up/Down (e.g., `P` + `Up/Down Arrow`)
  - Navigate between tasks/panes (e.g., `J`/`K` or `Up/Down Arrow` for lists)
  - Test all shortcuts for conflicts and usability

### Task 2.4: Quick Add Bar/Modal

- [ ] **2.4.1: Design Quick Add Interface**
  - Create a simple input field/modal using Shadcn Dialog or Command
  - Ensure it's minimal and non-disruptive
  - Make it visually distinct from the main task creation form
- [ ] **2.4.2: Implement Quick Add Functionality**
  - Allow specifying task title quickly
  - Add optional fields for project and status
  - Default to current project and "To Do" status when appropriate
  - Connect to Create Task API
- [ ] **2.4.3: Connect to Keyboard Shortcut**
  - Ensure the Quick Add interface is accessible via the global keyboard shortcut
  - Test the shortcut in various application states

## Phase 3: User Authentication (MVP)

### Task 3.1: Email & Password Authentication

- [x] **3.1.1: Create Registration Page/Form**
  - Create `/register` route and page
  - Implement form using Shadcn Form, Input, Button components
  - Include fields for name, email, password, password confirmation
  - Add validation for all fields
  - Connect to Auth.js registration endpoint
- [x] **3.1.2: Create Login Page/Form**
  - Create `/login` route and page
  - Implement form using Shadcn components
  - Include fields for email and password
  - Add validation for all fields
  - Connect to Auth.js login endpoint
- [x] **3.1.3: Implement Auth.js Email/Password Provider**
  - Configure Email/Password provider in `[...nextauth]/route.ts`
  - Implement secure password hashing
  - Set up email verification if needed
- [x] **3.1.4: Implement Session Management**
  - Protect routes/APIs that require authentication
  - Create a user context provider for the frontend
  - Implement logout functionality
  - Add session expiration handling

### Task 3.2: User Profile (Minimal)

- [x] **3.2.1: Create User Profile Page**
  - Create `/profile` route and page
  - Display user's name and email
  - Add option to update basic profile information
- [x] **3.2.2: Add Avatar Display**
  - If GitHub OAuth is implemented, display the user's GitHub avatar
  - Otherwise, consider using initials or a default avatar

### Task 3.3: GitHub OAuth Implementation

- [x] **3.3.1: Configure GitHub OAuth Provider**
  - Add and configure Auth.js GitHub provider
  - Set up the necessary environment variables
  - Update NextAuth callbacks to handle GitHub user data
- [x] **3.3.2: Add GitHub Sign-In UI**
  - Add "Sign in with GitHub" button to login/register pages
  - Implement appropriate styling and icons
  - Add divider between traditional login and OAuth options
- [x] **3.3.3: Handle GitHub User Data**
  - Implement logic to create or link user accounts from GitHub OAuth
  - Ensure proper handling of user data in Prisma
  - Update profile page to display GitHub avatar if available

## Phase 4: Basic Team Collaboration (MVP)

### Task 4.1: Project Sharing (Backend - API & Logic)

- [x] **4.1.1: Verify ProjectUser Join Table**
  - Ensure the `ProjectUser` join table is correctly defined in `schema.prisma`
  - Verify the relationship between Projects and Users
- [x] **4.1.2: Implement Invite User to Project API**
  - Create `POST /api/projects/[projectId]/collaborators` endpoint
  - Accept email/username of user to invite
  - Check if invited user exists in the system
  - Add entry to `ProjectUser` with 'COLLABORATOR' role
  - Prevent duplicate invites
  - Return success status or appropriate error
- [x] **4.1.3: Implement Remove User from Project API**
  - Create `DELETE /api/projects/[projectId]/collaborators/[userId]` endpoint
  - Require project ownership
  - Remove the specified user from the project
  - Return success status
- [x] **4.1.4: Implement List Collaborators API**
  - Create `GET /api/projects/[projectId]/collaborators` endpoint
  - Return list of users collaborating on the project
  - Include basic user details (id, name, email, role)
- [x] **4.1.5: Update Project/Task APIs for Collaboration**
  - Modify all Project/Task APIs to check for project ownership or collaboration
  - Use the `ProjectUser` table to verify access rights
  - Ensure appropriate error handling for unauthorized access

### Task 4.2: Project Sharing (Frontend - UI Components)

- [x] **4.2.1: Create Project Collaborator Invitation UI**
  - Add a project settings area accessible to project owners
  - Implement form to invite users by email/username
  - Connect to Invite User API
  - Show success/error feedback
- [x] **4.2.2: Create Collaborators List UI**
  - Display list of current collaborators in project settings
  - Show each collaborator's name and role
  - Add option for the owner to remove collaborators
  - Connect to Remove User API

### Task 4.3: Task Assignment

- [x] **4.3.1: Verify Task Assignee Field**
  - Ensure `assigneeId` (nullable ForeignKey to User) is on the `Task` model
  - Verify the relationship between Tasks and Users
- [x] **4.3.2: Update Task APIs for Assignment**
  - Modify Create Task and Update Task endpoints to handle `assigneeId`
  - Add validation for the assignee field
- [x] **4.3.3: Implement Assignee Validation**
  - Ensure the assignee must be a collaborator or owner of the project
  - Add appropriate error handling for invalid assignments
- [x] **4.3.4: Create Assignee Selection UI**
  - Add assignee dropdown to task creation/editing form
  - Fetch collaborators list from API
  - Populate dropdown with project collaborators and owner
  - Connect to Create/Update Task APIs
- [x] **4.3.5: Display Task Assignment**
  - Show assigned user's avatar/name on task cards/details
  - Use appropriate styling to make assignment clear
  - Handle unassigned tasks gracefully

## Phase 5: UI/UX (MVP)

### Task 5.1: General Design & Layout Refinement

- [ ] **5.1.1: Apply Consistent Design**
  - Review and refine the application's visual design
  - Ensure consistent use of Shadcn UI and Tailwind CSS
  - Apply a clean, minimalist aesthetic throughout
- [ ] **5.1.2: Refine Typography and Spacing**
  - Review and improve typography choices
  - Ensure consistent spacing and alignment
  - Enhance visual hierarchy for better readability
- [ ] **5.1.3: Optimize Information Density**
  - Balance information density with clarity
  - Ensure important information is easily scannable
  - Remove visual clutter

### Task 5.2: Responsiveness

- [ ] **5.2.1: Optimize Desktop Experience**
  - Prioritize and polish the desktop experience
  - Ensure optimal layout for common desktop resolutions
  - Test with various window sizes
- [ ] **5.2.2: Implement Tablet Responsiveness**
  - Test and ensure usability on common tablet resolutions
  - Adjust layouts and components as needed
  - Ensure touch targets are appropriately sized
- [ ] **5.2.3: Create Basic Mobile View**
  - Implement a simplified view for mobile devices
  - Focus on readability and essential functionality
  - Test on various mobile screen sizes

### Task 5.3: Performance Optimization

- [ ] **5.3.1: Leverage Next.js Performance Features**
  - Implement dynamic imports for code splitting
  - Use Next.js Image component for any images
  - Utilize server components where appropriate
- [ ] **5.3.2: Optimize API Performance**
  - Review and optimize database queries
  - Minimize payload sizes
  - Consider implementing basic caching
- [ ] **5.3.3: Enhance Frontend Performance**
  - Optimize state management to minimize re-renders
  - Use React.memo and useMemo where appropriate
  - Ensure smooth transitions and animations

## Phase 6: Deployment (MVP for Self-Hosting)

### Task 6.1: Dockerization

- [ ] **6.1.1: Create Dockerfile**
  - Create a multi-stage Dockerfile for the Next.js application
  - Include build and production stages
  - Optimize for size and security
- [ ] **6.1.2: Create docker-compose.yml**
  - Define `app` service that builds from Dockerfile
  - Configure port mapping (e.g., 3000:3000)
  - Set up volumes for Prisma migrations if needed
  - Define `db` service using official PostgreSQL image
  - Configure data volume for database persistence
  - Set environment variables for database credentials
  - Define network for services
- [ ] **6.1.3: Test Docker Deployment**
  - Verify `docker-compose up` works correctly
  - Ensure Prisma migrations run on startup
  - Test the application in the Docker environment

### Task 6.2: Configuration Management

- [x] **6.2.1: Set Up Environment Variables**
  - Ensure all configurations use environment variables
  - Include variables for:
    - DATABASE_URL
    - AUTH_SECRET
    - AUTH_GITHUB_ID (if implemented)
    - AUTH_GITHUB_SECRET (if implemented)
    - NEXTAUTH_URL
    - Other application-specific settings
- [x] **6.2.2: Create .env.example**
  - Create a template .env file with placeholders
  - Include comments explaining each variable
  - Keep this file updated as new variables are added

### Task 6.3: Self-Hosting Documentation

- [ ] **6.3.1: Write Self-Hosting Instructions**
  - Create clear, concise instructions in README.md
  - Include all necessary steps for self-hosting
  - Use a step-by-step format for clarity
- [ ] **6.3.2: Document Specific Setup Steps**
  - Instructions for cloning the repository
  - Steps to create and configure the .env file
  - Commands to start the application with Docker
  - If GitHub OAuth is implemented, include OAuth App setup instructions
  - Troubleshooting tips for common issues

## Phase 7: Testing & Final Polish

### Task 7.1: Basic Unit/Integration Tests

- [ ] **7.1.1: Set Up Testing Framework**
  - Install and configure Jest with React Testing Library
  - Set up test environment and configuration
- [ ] **7.1.2: Write API Tests**
  - Create tests for critical API endpoints
  - Cover authentication, project CRUD, and task CRUD
  - Include both success and error cases
- [ ] **7.1.3: Write UI Component Tests**
  - Test key UI components
  - Cover form submissions and validations
  - Test user interactions like task creation

### Task 7.2: Cross-Browser Testing

- [ ] **7.2.1: Test in Major Browsers**
  - Verify functionality in Chrome, Firefox, Safari, and Edge
  - Address any browser-specific issues
  - Ensure consistent appearance across browsers

### Task 7.3: Final UI/UX Review and Polish

- [ ] **7.3.1: Conduct Thorough Review**
  - Review the entire application for inconsistencies
  - Identify any bugs or usability issues
  - Look for opportunities to improve the user experience
- [ ] **7.3.2: Address Identified Issues**
  - Fix any bugs or inconsistencies
  - Implement usability improvements
  - Make final adjustments to styling and layout

### Task 7.4: Code Cleanup and Refactoring

- [ ] **7.4.1: Review Code Quality**
  - Review code for clarity and consistency
  - Ensure adherence to best practices
  - Check for potential performance issues
- [ ] **7.4.2: Remove Unused Code**
  - Eliminate dead code and unused imports
  - Remove console logs and debugging code
- [ ] **7.4.3: Refine Code Comments**
  - Remove unnecessary comments
  - Ensure complex logic has appropriate explanations
  - Keep code self-documenting where possible
- [x] **7.4.4: Fix API Route Parameters Issue**
  - Update dynamic API routes to properly await params object
  - Fix "params should be awaited before using its properties" error
  - Ensure all API routes with dynamic parameters follow Next.js best practices

## Phase 8: Developer-Centric UI/UX Overhaul

This phase focuses on transforming the application to be truly developer-focused, with an IDE-inspired interface, keyboard-driven workflows, and features that make it feel familiar and intuitive to developers.

### Task 8.6: Task Detail View Implementation

- [x] **8.6.1: Create Task Detail Dialog Component**

  - Implement a dialog component to display full task details
  - Show all task metadata (status, priority, due date, assignee, etc.)
  - Display the full task description with proper Markdown rendering
  - Include options to edit and delete the task
  - Add "Mark as Done" / "Reopen Task" functionality

- [x] **8.6.2: Update Task List to Use Detail View**
  - Make task titles clickable to open the detail view
  - Remove description preview from the task list
  - Ensure proper state management for opening/closing the detail view
  - Connect the detail view to task update and delete APIs

### Task 8.1: Core Navigation & Layout Redesign

- [x] **8.1.1: Replace Sidebar with Project Switcher in Navbar**

  - Remove the current sidebar that takes up screen space
  - Implement a dropdown-based project switcher in the Navbar
  - Include options for:
    - Switching between projects (with clear indication of current project)
    - "View All Projects" option
    - "New Project" option
    - Project settings access
  - Style to resemble IDE workspace/project switchers
  - Ensure keyboard accessibility (e.g., Alt+P to open)

- [x] **8.1.2: Implement Command Palette**

  - Install and configure a command palette library (or build custom)
  - Create a global keyboard shortcut (e.g., Ctrl+K or Cmd+K) to open
  - Implement search functionality within the palette
  - Add commands for:
    - Navigation (projects, tasks, profile)
    - Actions (create task/project, assign task, change status)
    - Filtering (by status, priority, assignee)
    - Settings and preferences
  - Style to resemble VS Code's command palette
  - Ensure proper keyboard navigation within the palette

- [x] **8.1.3: Add Global Quick Add Task Button**

  - Add a prominent "+" button in the Navbar
  - Implement keyboard shortcut (Shift+N)
  - Create a streamlined task creation modal
  - Auto-select current project when opened from a project page
  - Focus on the title field automatically for immediate typing

- [x] **8.1.4: Implement Breadcrumbs Navigation**
  - Add breadcrumbs below the Navbar
  - Show current navigation path (e.g., Projects > Project Name > Task)
  - Make each segment clickable for easy navigation
  - Ensure proper styling that fits with the developer-focused theme

### Task 8.2: Task Management Enhancements

- [x] **8.2.1: Create "My Tasks" View**

  - Implement a dedicated page showing all tasks assigned to the current user
  - Group tasks by project
  - Include the same sorting and filtering options as the project task view
  - Add a link to this view in the Navbar
  - Ensure it's accessible via the Command Palette

- [x] **8.2.2: Implement Kanban Board View**

  - Create an alternative view for tasks using a Kanban board layout
  - Organize columns by status ("To Do", "In Progress", "Blocked", "Done")
  - Implement drag-and-drop functionality to change task status
  - Add a view switcher between List and Board views
  - Ensure keyboard navigation works in both views

- [x] **8.2.3: Enhance Task List View**

  - Redesign the task list for higher information density
  - Add customizable columns (show/hide specific fields)
  - Implement inline editing for quick changes
  - Add task IDs for easier reference
  - Improve visual hierarchy with clearer status and priority indicators
  - Ensure consistent styling with monospaced fonts where appropriate

- [x] **8.2.3: Enhance Task List View**
- [x] **8.2.4: Improve Task Filtering and Sorting**

  - Redesign the filter controls to be more prominent
  - Add ability to save filter presets
  - Implement text-based filtering (e.g., filter by keywords in title/description)
  - Add advanced filtering options (e.g., tasks with no due date)
  - Persist filter preferences per project using localStorage

- [x] **8.2.4: Improve Task Filtering and Sorting**
- [x] **8.2.5: Enhance Markdown Editor Experience**
  - Improve the Markdown editor with better syntax highlighting
  - Add a toolbar for common Markdown formatting
  - Implement a side-by-side edit/preview mode
  - Add a "Zen Mode" for distraction-free writing
  - Ensure proper tab behavior for code indentation

### Task 8.3: Keyboard Navigation & Shortcuts

- [ ] **8.3.1: Implement Global Keyboard Shortcuts**

  - Create a comprehensive set of keyboard shortcuts:
    - Navigation shortcuts (e.g., g+p for projects, g+t for tasks)
    - Action shortcuts (e.g., n for new, e for edit)
    - View shortcuts (e.g., v+l for list view, v+b for board view)
  - Add a keyboard shortcut help modal (accessible via ? key)
  - Ensure shortcuts are consistent with common developer tools

- [ ] **8.3.2: Add Task-Focused Keyboard Navigation**

  - Implement arrow key navigation between tasks
  - Add shortcuts for common task actions:
    - Space to toggle completion
    - E to edit
    - D to delete
    - A to assign
    - S to change status
    - P to change priority
  - Ensure visual feedback for keyboard focus

- [ ] **8.3.3: Implement Form Field Navigation**
  - Ensure all forms are fully navigable via keyboard
  - Add shortcuts for form submission (Ctrl+Enter or Cmd+Enter)
  - Implement Escape key to cancel/close modals
  - Add tab order hints for complex forms

### Task 8.4: Email Integration & Notifications

- [ ] **8.4.1: Select and Integrate Email Service**

  - Research and select an email service (Resend, SendGrid, or Nodemailer)
  - Install the necessary packages
  - Set up environment variables for API keys
  - Create utility functions for sending emails

- [ ] **8.4.2: Implement Collaborator Invitation Emails**

  - Create an email template for project invitations
  - Send emails when users are invited to collaborate on a project
  - Include a direct link to the project in the email
  - Add proper error handling for email sending failures

- [ ] **8.4.3: Add Email Notification Settings**
  - Create user preferences for email notifications
  - Allow toggling notifications for:
    - Task assignments
    - Due date reminders
    - Mentions in comments (future feature)
  - Store preferences in the user profile

### Task 8.5: Developer-Focused UI Improvements

- [ ] **8.5.1: Implement IDE-like Aesthetics**

  - Refine the light and dark themes to resemble popular code editors
  - Use monospaced fonts for task IDs, code snippets, and other technical elements
  - Add subtle syntax highlighting-inspired color accents
  - Ensure high contrast for important information

- [ ] **8.5.2: Improve Loading & Empty States**

  - Replace text-based loading indicators with skeleton screens
  - Design developer-friendly empty states with clear calls to action
  - Add subtle animations for state transitions
  - Ensure consistent styling across all loading/empty states

- [ ] **8.5.3: Enhance Error Handling & Feedback**

  - Implement toast notifications for actions and errors
  - Add more detailed error messages with potential solutions
  - Include error codes for easier troubleshooting
  - Ensure errors are displayed in a non-disruptive manner

- [ ] **8.5.4: Improve Accessibility**
  - Conduct a thorough accessibility audit
  - Ensure proper contrast ratios for all text
  - Add ARIA attributes to custom components
  - Test with screen readers and keyboard-only navigation
  - Fix any identified accessibility issues
