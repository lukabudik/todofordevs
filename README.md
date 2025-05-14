# Project Definition: TodoForDevs - The Developer's To-Do List

## 1. Introduction & Vision

**1.1. The Problem:**
Many developers and small developer teams struggle with to-do list applications that are either too generic, bloated with features irrelevant to their workflow, overly complex to manage, or difficult to self-host and control. Existing solutions often lack the specific nuances that make a productivity tool truly effective for a software development context.

**1.2. Our Solution: TodoForDevs**
TodoForDevs is envisioned as an open-source, no-nonsense to-do list application meticulously designed for developers. It prioritizes speed, simplicity, and features that integrate seamlessly into a developer's daily routine. It will be easily self-hostable, with the potential for a future, hassle-free hosted option.

**1.3. Core Values:**

- **Developer-Centric:** Built by developers, for developers.
- **Simplicity & Focus:** "No-nonsense" - only essential features, elegantly implemented.
- **Speed & Efficiency:** A tool that gets out of your way and lets you focus on tasks.
- **Control & Ownership:** Open-source and easy to self-host.
- **Clean & Intuitive UI:** Minimalist, keyboard-friendly, and aesthetically pleasing for developers.

## 2. Target Audience

- **Primary:** Individual software developers.
- **Secondary:** Small developer teams (2-10 members) looking for a straightforward, shared task management solution.

## 3. Key Differentiators (MVP Focus)

TodoForDevs will stand out by focusing on features that directly address developer pain points and preferences:

1.  **Markdown-Native Experience:** Rich text formatting with full GitHub Flavored Markdown (GFM) support, including tables, task lists, etc., for all task descriptions and comments. This is fundamental, not an afterthought.
2.  **First-Class Code Snippet Handling:** Seamless embedding and syntax highlighting of code blocks within task descriptions. Developers live in code; their to-do list should too.
3.  **Keyboard-Driven Workflow:** Extensive keyboard shortcuts for all common actions, minimizing mouse reliance and boosting efficiency. A command palette is a future goal, but basic shortcuts are MVP.
4.  **Blazing Fast & Uncluttered UI:** A clean, minimalist interface that loads quickly and presents information clearly. Includes essential Light & Dark modes.
5.  **Effortless Self-Hosting:** One-command Docker deployment (`docker-compose up`) is a primary deliverable, making it trivial to run on a personal server or private cloud.
6.  **Open Source & Transparent:** Built in the open, fostering community contributions and ensuring users can trust and modify the tool.
7.  **Quick Add Functionality:** Globally accessible (or very easily reached) input for adding tasks quickly without disrupting workflow.

## 4. MVP Feature Set

The MVP aims to deliver a usable, valuable product embodying the core values and differentiators.

**4.1. Core Task Management:**
_ **Projects/Lists:**
_ Users can create, rename, and delete Projects (which are essentially lists of tasks).
_ Each project is initially private to the creator.
_ **Tasks:**
_ **Creation:** Add tasks with a Title and a detailed Markdown-enabled Description.
_ **Attributes:**
_ Status (e.g., "To Do", "In Progress", "Blocked", "Done") - customizable default statuses.
_ Priority (e.g., "Low", "Medium", "High", "Urgent") - visual indicators.
_ Due Date (optional, simple date picker).
_ Assignee (within a shared project, see 4.4).
_ **Editing:** Modify any task attribute.
_ **Deletion:** Remove tasks.
_ **Viewing:**
_ List tasks within a project.
_ Basic sorting (by due date, priority, creation date, status).
_ Basic filtering (by status, priority, assignee).

**4.2. Developer-Specific Features (MVP):**
_ **Markdown Editor & Renderer:**
_ A clean, intuitive Markdown editor for task descriptions.
_ Live preview or easy toggle to see rendered Markdown.
_ Full GFM support, including inline `code` and fenced `code blocks`.
_ **Syntax Highlighting:**
_ Automatic syntax highlighting for common languages within fenced code blocks in rendered Markdown.
_ **Keyboard Shortcuts (Essential Set):**
_ Global: Open Quick Add Task modal/bar.
_ In-App: New Task, Save Task, Close/Cancel, Edit Task, Mark as Done, Cycle Status, Assign Priority Up/Down, Navigate between tasks/panes.
_ **Quick Add Bar/Modal:** \* A simple input field (accessible via shortcut) to quickly create a task with a title (and optionally assign to a default project/status).

**4.3. User Authentication (MVP):**
_ **Provider:** Auth.js (formerly NextAuth.js).
_ **Methods (MVP):**
_ Email & Password: Standard registration and login.
_ (HIGHLY RECOMMENDED STRETCH GOAL for MVP, or V1.0.1) GitHub OAuth: Crucial for developer appeal and ease of sign-up.
_ **Session Management:** Secure session handling via Auth.js.
_ **User Profile:** Minimal (name, email, avatar from OAuth if used). \* **Self-Hosted Note:** For self-hosted instances, OAuth will require users to set up their own GitHub OAuth App credentials. Email/Password is more self-contained. The Docker setup should allow configuring these.

**4.4. Basic Team Collaboration (MVP):**
_ **Project Sharing:**
_ A project owner can invite other _registered_ TodoForDevs users to collaborate on their project.
_ Invitations can be sent via email (if SMTP is configured for self-hosted) or by sharing a unique link with a registered user.
_ (Simpler MVP: Invite by typing registered username/email; no separate invite system).
_ **Shared Project Access:**
_ Invited users (Collaborators) can view, create, edit, and change the status of tasks within the shared project.
_ The project owner retains administrative rights (e.g., renaming/deleting the project, managing collaborators).
_ **Task Assignment:**
_ Within a shared project, tasks can be assigned to any collaborator (including the owner).
_ Clear visual indication of who is assigned to a task. \* **No Complex Organization Structure for MVP:** Focus on simple project-level sharing between individual users.

**4.5. UI/UX (MVP):**
_ **Design:** Clean, minimalist, with good typography and spacing. Focus on information density without clutter.
_ **Responsiveness:** Primarily desktop-focused but usable on tablet devices. Mobile view for quick checks is a plus but not the primary design target for MVP.
_ **Themes:** Essential Light and Dark modes.
_ **Performance:** Fast load times and snappy interactions.

**4.6. Deployment (MVP for Self-Hosting):**
_ **Docker:** `Dockerfile` and `docker-compose.yml` for one-command deployment.
_ **Database:** Default configuration for PostgreSQL in `docker-compose.yml`.
_ **Configuration:** All necessary configurations (database URL, auth secrets, SMTP for self-hosted email invites) managed via environment variables.
_ **README:** Clear, concise instructions for self-hosting TodoForDevs using Docker, including OAuth setup if applicable.

## 5. Non-Goals for MVP

To maintain focus and deliver a lean, high-quality initial product, the following are explicitly out of scope for the MVP:

- **Full Organization/Workspace Management:** No multi-level teams, organization-wide settings, or complex role hierarchies beyond project owner/collaborator.
- **Advanced API:** No public API for third-party integrations beyond what's needed for the core application and potential future CLI.
- **Complex Integrations:** No direct integrations with Git hosting platforms, CI/CD, calendars (beyond simple due dates), or chat tools.
- **Native Mobile Apps:** Web-first approach.
- **Full-Fledged Hosted Service Infrastructure:** While the tech stack is chosen with hosting in mind, the MVP focuses on the application itself. The billing, multi-tenant management, and specific limitations for a hosted free/paid tier are post-MVP concerns for TodoForDevs.
- **Time Tracking, Sub-Tasks, Task Dependencies, Gantt Charts.**
- **Advanced Reporting or Analytics.**
- **Real-time Multi-User Editing (e.g., via WebSockets):** Standard request-response or optimistic updates are sufficient for MVP.
- **Command Palette (like VS Code's `Ctrl+Shift+P`):** A powerful feature for later, but basic shortcuts are MVP.
- **Customizable Workflows/Statuses beyond a predefined set.**
- **Offline Support / PWA features (beyond basic caching).**

## 6. Tech Stack

- **Frontend:** Next.js (React, TypeScript)
- **Backend (API):** Next.js API Routes / Route Handlers (TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL (primary target for development and default for Dockerized self-hosting).
- **Authentication:** Auth.js (using Prisma adapter).
- **Styling:** Shadcn, Tailwind CSS,...?
- **Deployment (Self-Hosted):** Docker, Docker Compose.

## 7. Future Considerations (Post-MVP)

- **Enhanced Team Management:** Introduce "Organizations" or "Workspaces" to TodoForDevs with centralized user management, roles, and project grouping.
- **Public API & Webhooks:** For extensibility and integration with other developer tools.
- **Command Palette:** For advanced keyboard control.
- **CLI Tool:** For managing tasks from the terminal.
- **Official Hosted Version of TodoForDevs:** Offer a managed, hosted service with potential free/paid tiers.
- **Deeper Integrations:** e.g., link tasks to GitHub Issues/PRs more directly.
- **Calendar View / Due Date Reminders.**
- **Customizable Themes & Statuses.**
- **Enhanced Search & Filtering.**

This document provides a blueprint for the TodoForDevs MVP, focusing on delivering immediate value to developers by emphasizing features they care about, in a simple, fast, and accessible package.
