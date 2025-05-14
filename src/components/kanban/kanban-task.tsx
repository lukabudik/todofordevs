"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskActions } from "@/components/tasks/TaskActions";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { formatDistanceToNow } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assigneeId: string | null;
  assignee?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
}

interface KanbanTaskProps {
  task: Task;
  projectId: string;
  onTaskClick: (taskId: string) => void;
  onEditClick: (taskId: string) => void;
  onTaskUpdate?: (taskId: string, data: Partial<Task>) => Promise<void>;
}

export function KanbanTask({
  task,
  projectId,
  onTaskClick,
  onEditClick,
  onTaskUpdate,
}: KanbanTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1000 : 1,
    // Remove cursor styling as it might interfere with dragging
  };

  // Priority colors
  const priorityColors = {
    Low: "bg-blue-500",
    Medium: "bg-yellow-500",
    High: "bg-orange-500",
    Urgent: "bg-red-500",
  };

  // Format due date
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  // Format updated time
  const updatedTimeAgo = formatDistanceToNow(new Date(task.updatedAt), {
    addSuffix: true,
  });

  // Generate initials for assignee avatar if no image is available
  const getInitials = () => {
    if (!task.assignee?.name) return "?";
    return task.assignee.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 flex flex-col rounded-md border bg-card p-3 shadow-sm transition-all duration-200 select-none cursor-pointer ${
        isDragging
          ? "shadow-none border-dashed"
          : "hover:bg-accent/50 hover:shadow-md hover:-translate-y-0.5"
      }`}
      tabIndex={0}
      aria-roledescription="Draggable task"
      data-task-id={task.id}
      onClick={(e) => {
        // Prevent click when dragging
        if (!isDragging) {
          // Don't trigger if clicking on the task options
          if (!(e.target as HTMLElement).closest(".task-options")) {
            onTaskClick(task.id);
          }
        }
      }}
    >
      <div className="mb-2 flex items-start justify-between group">
        <h3 className="text-base font-medium">{task.title}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
            <div
              className={`h-2 w-2 rounded-full ${
                priorityColors[task.priority as keyof typeof priorityColors] ||
                "bg-gray-500"
              }`}
            />
            <span className="text-xs font-medium">{task.priority}</span>
          </div>
          <div className="task-options">
            <TaskActions
              task={{ ...task, projectId }}
              onTaskUpdate={onTaskUpdate}
              onEditClick={onEditClick}
            />
          </div>
        </div>
      </div>

      {task.description && (
        <div className="mb-2 max-h-24 overflow-hidden text-sm text-muted-foreground rounded-sm">
          <MarkdownRenderer
            content={
              task.description.length > 100
                ? `${task.description.substring(0, 100)}...`
                : task.description
            }
          />
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        {formattedDueDate && (
          <div className="text-xs text-muted-foreground">
            Due: {formattedDueDate}
          </div>
        )}

        {task.assignee && (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
            title={task.assignee.name || "Assigned user"}
          >
            {task.assignee.image ? (
              <img
                src={task.assignee.image}
                alt={task.assignee.name || "User"}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              getInitials()
            )}
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-muted-foreground opacity-70">
        Updated {updatedTimeAgo}
      </div>
    </div>
  );
}
