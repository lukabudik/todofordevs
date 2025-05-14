# TodoForDevs UX Improvement Checklist

This document outlines the comprehensive plan for improving the UX of the TodoForDevs application, with a focus on making task management more intuitive, consistent, and developer-friendly.

## 1. Task Management Flow Redesign

### 1.1 Unified Task Interface

- [x] Create a unified `TaskForm` component to replace multiple dialog implementations
  - [x] Refactor `TaskFormDialog.tsx` to use the new unified component
  - [x] Refactor `QuickAddDialog.tsx` to use the new unified component
  - [ ] Ensure responsive design (modal on desktop, full-screen on mobile)
- [x] Standardize form fields and validation across all task creation/editing interfaces
  - [x] Consistent field order: title, description, status, priority, due date, assignee
  - [x] Unified validation logic and error handling
- [x] Implement progressive disclosure pattern for task creation
  - [x] Quick add with just title and project
  - [x] "Add details" option to expand to full form

### 1.2 Contextual Task Actions

- [x] Create a consistent `TaskActions` component for all task-related actions
  - [x] Replace current `TaskOptions` component
  - [x] Ensure same actions appear in the same location across all views
- [x] Standardize edit, delete, and status change actions
  - [x] Consistent icon and label usage
  - [x] Uniform confirmation dialogs
- [x] Implement a "quick actions" toolbar for common operations
  - [x] Status change
  - [x] Priority change
  - [x] Assignee change
  - [x] Due date modification

### 1.3 Task Detail View Consolidation

- [x] Consolidate `TaskDetailDialog` and `TaskDetailPanel` into a single component
  - [x] Create a unified `TaskDetail` component
  - [x] Use a Notion-like side panel design (removed dialog mode)
- [x] Remove inline editing from list view
  - [x] Replace with consistent edit action that opens the unified form
- [x] Implement a clear visual hierarchy for task information
  - [x] Primary: title, status, assignee
  - [x] Secondary: description, due date, priority
  - [x] Tertiary: creation date, update date, etc.
- [x] Simplify the editing experience in the TaskDetail panel
  - [x] Open panel directly in edit mode when "Edit" is clicked from task actions
  - [x] Replace separate edit buttons with a single edit/view toggle
  - [x] Make all fields editable in a single edit mode

## 2. Navigation & Information Architecture

### 2.1 Navigation Redesign

- [x] Remove "My Tasks" feature completely
  - [x] Update `navbar.tsx` to remove My Tasks link
  - [x] Remove My Tasks link from command palette
  - [x] Delete My Tasks page and API endpoint
  - [x] Plan for future central hub implementation
- [ ] Create a clear navigation hierarchy
  - [ ] Dashboard (overview)
  - [ ] Projects (list and management)
  - [ ] Settings (user and workspace)
- [ ] Implement a collapsible sidebar similar to VS Code/GitHub
  - [ ] Add collapse/expand functionality
  - [ ] Show icons only when collapsed
  - [ ] Add tooltips for collapsed state

### 2.2 Contextual Top Bar

- [ ] Redesign top bar to focus on context-specific actions
  - [ ] Update `navbar.tsx` to be context-aware
- [ ] Implement breadcrumbs for current location
  - [ ] Create `Breadcrumbs` component
  - [ ] Show path: Project > Task
- [ ] Add quick actions relevant to the current context
  - [ ] Project-specific actions when in a project
  - [ ] Task-specific actions when viewing a task

### 2.3 Command Palette Enhancement

- [ ] Enhance command palette for quick access to all tasks
  - [ ] Update `command-palette.tsx` with new functionality
- [ ] Add keyboard shortcuts for common actions
  - [ ] Task creation: Ctrl/Cmd + N
  - [ ] Task search: Ctrl/Cmd + F
  - [ ] Quick task navigation: Ctrl/Cmd + T
- [ ] Implement "go to task" feature
  - [ ] Fuzzy search across all tasks
  - [ ] Recent tasks section
  - [ ] Favorite/pinned tasks

## 3. Kanban Board Improvements

### 3.1 Enhanced Drag and Drop

- [x] Improve drag and drop with clearer visual cues
  - [x] Update `kanban-board.tsx` and `kanban-task.tsx`
  - [x] Add drop zone highlighting
  - [x] Implement smoother animations during drag
- [x] Add drag handles to make draggable items more obvious
  - [x] Visual indicator for draggable items
  - [x] Cursor change on hover
- [x] Implement better placeholder visualization during dragging
  - [x] Show ghost card in original position
  - [x] Preview card in potential drop position

## 4. Visual Design Consistency

### 4.1 Design System Refinement

- [x] Replace emojis with consistent iconography
  - [x] Update all instances of emoji usage with Lucide icons
  - [x] Status icons: To Do, In Progress, Blocked, Done
  - [ ] Priority icons: Low, Medium, High, Urgent
- [x] Implement a cleaner, more minimalistic design
  - [x] Reduce visual noise
  - [x] Increase whitespace
  - [x] Simplify UI elements
- [ ] Create a cohesive color system
  - [ ] Define semantic colors for status, priority
  - [ ] Ensure accessibility (contrast ratios)
  - [ ] Consistent application across the app

### 4.2 Task Card Redesign

- [x] Simplify task cards
  - [x] Focus on title, status, assignee
  - [x] Show description preview only when relevant
- [ ] Improve visual hierarchy
  - [ ] Clear typographic scale
  - [ ] Consistent spacing
  - [ ] Visual weight for important elements
- [ ] Use subtle visual cues instead of explicit labels
  - [ ] Color accents for status/priority
  - [ ] Position and size to indicate importance
  - [ ] Icons instead of text where appropriate

## 5. Developer-Focused Enhancements

### 5.1 IDE-Inspired Features

- [ ] Add keyboard shortcuts for all common actions
  - [ ] Document all shortcuts
  - [ ] Add shortcut hints to UI
- [ ] Implement code block support
  - [ ] Syntax highlighting in task descriptions
  - [ ] Code-specific formatting options
- [ ] Add tagging system
  - [ ] @ mentions for team members
  - [ ] # references for tasks/projects
  - [ ] ! for priorities

### 5.2 Integration Capabilities

- [ ] Improve GitHub/GitLab integration
  - [ ] Reference issues/PRs
  - [ ] Link commits to tasks
- [ ] Add support for linking to external tools
  - [ ] Figma
  - [ ] Jira
  - [ ] Documentation sites
- [ ] Implement a plugin system
  - [ ] API for extensions
  - [ ] Custom views
  - [ ] Integration hooks

### 5.3 Developer Workflow Optimization

- [ ] Add templates for common development tasks
  - [ ] Bug fix template
  - [ ] Feature implementation template
  - [ ] Code review template
- [ ] Implement task dependencies and blockers
  - [ ] Visual representation of dependencies
  - [ ] Blocker notification system
- [ ] Create views optimized for development workflows
  - [ ] Sprint planning view
  - [ ] Retrospective view
  - [ ] Code review dashboard

## Implementation Phases

### Phase 1: Consolidation & Consistency

- [x] Unify task interfaces
  - [x] Create unified TaskForm component
  - [x] Create consistent TaskActions component
  - [x] Consolidate task detail views
- [x] Remove "My Tasks" feature completely
  - [x] Update navigation structure
  - [x] Plan for future central hub
- [x] Remove emojis and standardize iconography
  - [x] Replace all emoji usage
  - [x] Implement consistent icon system

### Phase 2: Interaction Improvements

- [x] Enhance kanban board
  - [x] Improve drag and drop
    - [x] Fix issue with actions menu triggering drag mode
    - [x] Make drop zones more intuitive
    - [x] Add visual cues for dragging
  - [ ] Implement column management
  - [ ] Redesign task cards
- [ ] Add keyboard shortcuts
  - [ ] Define shortcut system
  - [ ] Implement in command palette
  - [ ] Add visual indicators

### Phase 3: Developer-Specific Features

- [ ] Add code block support
  - [ ] Syntax highlighting
  - [ ] Code-specific formatting
- [ ] Implement integrations
  - [ ] GitHub/GitLab
  - [ ] External tools
- [ ] Create developer-focused templates
  - [ ] Task templates
  - [ ] Development workflow views
