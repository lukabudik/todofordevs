# Lint Errors Checklist

## Unused Variables (@typescript-eslint/no-unused-vars)

- [ ] src/app/page.tsx:41:18 - '\_error' is defined but never used.
- [ ] src/components/command/command-palette.tsx:49:18 - '\_error' is defined but never used.
- [x] src/components/kanban/kanban-board.tsx:140:13 - 'active' is assigned a value but never used.
- [x] src/components/kanban/kanban-column.tsx:77:9 - 'statusColors' is assigned a value but never used.
- [ ] src/components/layout/breadcrumbs.tsx:51:20 - '\_error' is defined but never used.
- [ ] src/components/layout/sidebar.tsx:29:16 - '\_err' is defined but never used.
- [ ] src/components/projects/project-collaborators.tsx:89:14 - '\_err' is defined but never used.
- [ ] src/components/projects/project-switcher.tsx:78:16 - '\_err' is defined but never used.
- [ ] src/components/projects/project-switcher.tsx:299:24 - '\_err' is defined but never used.
- [ ] src/components/tasks/TaskActions.tsx:162:14 - '\_err' is defined but never used.
- [ ] src/components/tasks/TaskActions.tsx:173:14 - '\_err' is defined but never used.
- [ ] src/components/tasks/TaskActions.tsx:186:14 - '\_err' is defined but never used.
- [ ] src/components/tasks/TaskActions.tsx:225:14 - '\_err' is defined but never used.
- [ ] src/components/tasks/TaskDetail.tsx:174:16 - '\_error' is defined but never used.
- [ ] src/components/tasks/TaskDetail.tsx:199:16 - '\_error' is defined but never used.
- [ ] src/components/tasks/TaskDetail.tsx:232:14 - '\_error' is defined but never used.
- [ ] src/components/tasks/TaskDetail.tsx:278:14 - '\_error' is defined but never used.
- [ ] src/components/tasks/TaskDetail.tsx:303:14 - '\_error' is defined but never used.
- [ ] src/components/tasks/TaskDetail.tsx:318:14 - '\_error' is defined but never used.
- [ ] src/components/tasks/TaskDetail.tsx:586:36 - '\_error' is defined but never used.
- [ ] src/components/tasks/dialogs/QuickAddDialog.tsx:67:18 - '\_err' is defined but never used.
- [ ] src/components/tasks/dialogs/TaskFormDialog.tsx:70:14 - '\_err' is defined but never used.
- [ ] src/lib/auth.ts:88:15 - 'user' is assigned a value but never used.

## Missing Dependencies in useEffect (@react-hooks/exhaustive-deps)

- [x] src/app/verify-email/page.tsx:67:6 - React Hook useEffect has a missing dependency: 'router'. Either include it or remove the dependency array.
- [x] src/components/markdown/enhanced-markdown-editor.tsx:86:9 - The 'insertText' function makes the dependencies of useEffect Hook (at line 225) change on every render. To fix this, wrap the definition of 'insertText' in its own useCallback() Hook.
- [x] src/components/tasks/dialogs/TaskFormDialog.tsx:57:6 - React Hook useEffect has a missing dependency: 'fetchCollaborators'. Either include it or remove the dependency array.
- [x] src/components/tasks/filters/TaskFilters.tsx:176:6 - React Hook useEffect has missing dependencies: 'sortBy' and 'sortOrder'. Either include them or remove the dependency array.

## Explicit Any Types (@typescript-eslint/no-explicit-any)

- [x] src/components/tasks/TaskDetail.tsx:286:56 - Unexpected any. Specify a different type.
- [x] src/lib/email.ts:51:29 - Unexpected any. Specify a different type.
- [x] src/lib/email.ts:127:39 - Unexpected any. Specify a different type.
- [x] src/lib/email.ts:127:51 - Unexpected any. Specify a different type.
- [x] src/lib/email.ts:129:29 - Unexpected any. Specify a different type.

## Next.js Specific Warnings

- [ ] src/components/email/email-layout.tsx:13:5 - Do not use `<head>` element. Use `<Head />` from `next/head` instead.
- [ ] src/components/kanban/kanban-task.tsx:160:15 - Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image`.
- [ ] src/components/layout/navbar.tsx:65:25 - Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image`.
- [ ] src/components/tasks/TaskDetail.tsx:646:23 - Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image`.
- [ ] src/components/tasks/list/TaskList.tsx:267:25 - Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image`.

## Accessibility Warnings

- [x] src/components/markdown/enhanced-markdown-editor.tsx:153:13 - Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.
