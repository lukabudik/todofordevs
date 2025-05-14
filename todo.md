# TodoForDevs Code Cleanup Checklist

## Project Structure Reorganization

- [x] Create new folder structure for tasks components
  - [x] Create `src/components/tasks/list` folder
  - [x] Create `src/components/tasks/filters` folder
  - [x] Create `src/components/tasks/dialogs` folder
  - [x] Move and rename components to their appropriate folders

## Components

### Tasks Components

- [x] `src/components/tasks/list/TaskList.tsx` - Renamed from enhanced-task-list.tsx, cleaned up
- [x] `src/components/tasks/list/index.ts` - Created to export TaskList and maintain backward compatibility
- [x] `src/components/tasks/filters/TaskFilters.tsx` - Renamed from enhanced-filters.tsx, cleaned up
- [x] `src/components/tasks/filters/index.ts` - Created to export TaskFilters and maintain backward compatibility
- [x] `src/components/tasks/dialogs/QuickAddDialog.tsx` - Renamed from quick-add-task-dialog.tsx, cleaned up
- [x] `src/components/tasks/dialogs/TaskFormDialog.tsx` - Renamed from task-form-dialog.tsx, cleaned up
- [x] `src/components/tasks/dialogs/TaskDetailDialog.tsx` - Renamed from task-detail-dialog.tsx, cleaned up
- [x] `src/components/tasks/dialogs/TaskDetailPanel.tsx` - Renamed from task-detail-panel.tsx, cleaned up
- [x] `src/components/tasks/dialogs/index.ts` - Created to export all dialog components
- [x] `src/components/tasks/task-options.tsx` - Updated import for TaskFormDialog
- [ ] `src/components/tasks/enhanced-list/enhanced-task-list.tsx` - To be removed (replaced by TaskList)
- [ ] `src/components/tasks/enhanced-list/index.ts` - To be removed (replaced by list/index.ts)
- [ ] `src/components/tasks/filters/enhanced-filters.tsx` - To be removed (replaced by TaskFilters)
- [ ] `src/components/tasks/quick-add-task-dialog.tsx` - To be removed (replaced by QuickAddDialog)
- [ ] `src/components/tasks/task-form-dialog.tsx` - To be removed (replaced by TaskFormDialog)
- [ ] `src/components/tasks/task-detail-dialog.tsx` - To be removed (replaced by TaskDetailDialog)
- [ ] `src/components/tasks/task-detail-panel.tsx` - To be removed (replaced by TaskDetailPanel)

### Kanban Components

- [x] `src/components/kanban/kanban-board.tsx` - Updated import for TaskDetailPanel
- [x] `src/components/kanban/kanban-column.tsx` - Reviewed, no changes needed
- [x] `src/components/kanban/kanban-task.tsx` - Reviewed, no changes needed
- [x] `src/components/kanban/view-switcher.tsx` - Reviewed, no changes needed

### Markdown Components

- [x] `src/components/markdown/markdown-renderer.tsx` - Reviewed, no changes needed
- [x] `src/components/markdown/markdown-editor.tsx` - Reviewed, no changes needed
- [x] `src/components/markdown/enhanced-markdown-editor.tsx` - Reviewed, no changes needed
- [x] `src/components/markdown/index.ts` - Reviewed, no changes needed

### Project Components

- [x] `src/components/projects/new-project-dialog.tsx` - Reviewed, no changes needed
- [x] `src/components/projects/project-collaborators.tsx` - Reviewed, no changes needed
- [x] `src/components/projects/project-options.tsx` - Reviewed, no changes needed
- [x] `src/components/projects/project-switcher.tsx` - Reviewed, no changes needed

### Layout Components

- [x] `src/components/layout/breadcrumbs.tsx` - Reviewed, no changes needed
- [x] `src/components/layout/main-layout.tsx` - Reviewed, no changes needed
- [x] `src/components/layout/navbar.tsx` - Updated imports to use new component paths
- [x] `src/components/layout/sidebar.tsx` - Reviewed, no changes needed

### Command Components

- [x] `src/components/command/command-palette.tsx` - Reviewed, no changes needed

### Email Components

- [x] `src/components/email/email-layout.tsx` - Reviewed, no changes needed
- [x] `src/components/email/verification-email.tsx` - Reviewed, no changes needed
- [x] `src/components/email/password-reset-email.tsx` - Reviewed, no changes needed
- [x] `src/components/email/project-invitation-email.tsx` - Reviewed, no changes needed

### Provider Components

- [x] `src/components/providers/providers.tsx` - Reviewed, no changes needed
- [x] `src/components/providers/session-provider.tsx` - Reviewed, no changes needed
- [x] `src/components/providers/theme-provider.tsx` - Reviewed, no changes needed

### UI Components

- [x] `src/components/ui/badge.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/button.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/command.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/dialog.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/dropdown-menu.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/checkbox.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/input.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/label.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/popover.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/select.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/textarea.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/theme-toggle.tsx` - Reviewed, no changes needed
- [x] `src/components/ui/tooltip.tsx` - Reviewed, no changes needed

## Pages

### Auth Pages

- [x] `src/app/(auth)/layout.tsx` - Reviewed, no changes needed
- [x] `src/app/(auth)/login/page.tsx` - Reviewed, no changes needed
- [x] `src/app/(auth)/register/page.tsx` - Reviewed, no changes needed
- [x] `src/app/(auth)/forgot-password/page.tsx` - Reviewed, no changes needed
- [x] `src/app/(auth)/reset-password/page.tsx` - Reviewed, no changes needed

### Dashboard Pages

- [x] `src/app/(dashboard)/layout.tsx` - Reviewed, no changes needed
- [x] `src/app/(dashboard)/my-tasks/page.tsx` - Updated imports to use new component paths
- [x] `src/app/(dashboard)/profile/page.tsx` - Reviewed, no changes needed
- [x] `src/app/(dashboard)/projects/page.tsx` - Reviewed, no changes needed
- [x] `src/app/(dashboard)/projects/[projectId]/page.tsx` - Updated imports to use new component paths

### Other Pages

- [x] `src/app/layout.tsx` - Reviewed, no changes needed
- [x] `src/app/page.tsx` - Reviewed, no changes needed
- [x] `src/app/logout/page.tsx` - Reviewed, no changes needed
- [x] `src/app/resend-verification/page.tsx` - Reviewed, no changes needed
- [x] `src/app/verify-email/page.tsx` - Reviewed, no changes needed

## API Routes

### Auth API Routes

- [x] `src/app/api/auth/[...nextauth]/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/auth/check-verification/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/auth/forgot-password/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/auth/register/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/auth/resend-verification/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/auth/reset-password/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/auth/reset-password/verify/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/auth/verify-email/route.ts` - Reviewed, no changes needed

### Invitations API Routes

- [x] `src/app/api/invitations/verify/route.ts` - Reviewed, no changes needed

### Projects API Routes

- [x] `src/app/api/projects/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/projects/[projectId]/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/projects/[projectId]/collaborators/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/projects/[projectId]/collaborators/[userId]/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/projects/[projectId]/invitations/[invitationId]/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/projects/[projectId]/invitations/[invitationId]/resend/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/projects/[projectId]/tasks/route.ts` - Reviewed, no changes needed

### Tasks API Routes

- [x] `src/app/api/tasks/[taskId]/route.ts` - Reviewed, no changes needed

### User API Routes

- [x] `src/app/api/user/profile/route.ts` - Reviewed, no changes needed
- [x] `src/app/api/user/tasks/route.ts` - Reviewed, no changes needed

## Library Files

- [x] `src/lib/email.ts` - Reviewed, no changes needed
- [x] `src/lib/prisma.ts` - Reviewed, no changes needed
- [x] `src/lib/utils.ts` - Reviewed, no changes needed

## Configuration Files

- [x] `.env` - Reviewed, no changes needed
- [x] `.env.example` - Reviewed, no changes needed
- [x] `.gitignore` - Reviewed, no changes needed
- [x] `.prettierrc.json` - Reviewed, no changes needed
- [x] `components.json` - Reviewed, no changes needed
- [x] `eslint.config.mjs` - Reviewed, no changes needed
- [x] `next.config.ts` - Reviewed, no changes needed
- [x] `package.json` - Reviewed, no changes needed
- [x] `postcss.config.mjs` - Reviewed, no changes needed
- [x] `tailwind.config.ts` - Reviewed, no changes needed
- [x] `tsconfig.json` - Reviewed, no changes needed

## Prisma Files

- [x] `prisma/schema.prisma` - Reviewed, no changes needed
- [x] `prisma/migrations/migration_lock.toml` - Reviewed, no changes needed
- [x] `prisma/migrations/20250514000000_initial_setup/migration.sql` - Reviewed, no changes needed
- [x] `prisma/migrations/20250514133820_add_email_logs/migration.sql` - Reviewed, no changes needed
- [x] `prisma/migrations/20250514144624_add_password_reset_token/migration.sql` - Reviewed, no changes needed
- [x] `prisma/migrations/20250514151701_add_pending_invitations/migration.sql` - Reviewed, no changes needed

## Other Files

- [x] `src/middleware.ts` - Reviewed, no changes needed
- [x] `src/types/next-auth.d.ts` - Reviewed, no changes needed
- [x] `README.md` - Reviewed, no changes needed

## Notes on Changes Made

### Task Components Reorganization

1. Created a more organized folder structure for task components:

   - `list` folder for list-related components
   - `filters` folder for filter-related components
   - `dialogs` folder for dialog-related components

2. Renamed components to follow a more consistent naming convention:

   - `EnhancedTaskList` → `TaskList`
   - `EnhancedFilters` → `TaskFilters`
   - `QuickAddTaskDialog` → `QuickAddDialog`
   - `TaskFormDialog` → `TaskFormDialog` (kept the same name)
   - `TaskDetailDialog` → `TaskDetailDialog` (kept the same name)
   - `TaskDetailPanel` → `TaskDetailPanel` (kept the same name)

3. Created index.ts files in each folder to export the components and maintain backward compatibility.

4. Updated imports in the TaskDetailDialog to use the new import path for TaskFormDialog.

Next steps:

1. Update imports in all files that use these components
2. Remove the old component files once all imports are updated
3. Continue with the rest of the files in the checklist
