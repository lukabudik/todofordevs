"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow } from "date-fns";
import { GripVertical } from "lucide-react";
import Image from "next/image";

import { TaskActions } from "@/components/tasks/TaskActions";

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
      className={`mb-2 flex flex-col rounded-md border bg-card p-3 shadow-sm transition-all duration-200 select-none ${
        isDragging
          ? "shadow-lg border-dashed border-primary/50 opacity-50"
          : "hover:bg-accent/50 hover:shadow-md"
      }`}
      tabIndex={0}
      aria-roledescription="Draggable task"
      data-task-id={task.id}
      onClick={(e) => {
        // Prevent click when dragging
        if (!isDragging) {
          // Don't trigger if clicking on the task options or drag handle
          if (
            !(e.target as HTMLElement).closest(".task-options") &&
            !(e.target as HTMLElement).closest(".drag-handle")
          ) {
            onTaskClick(task.id);
          }
        }
      }}
    >
      <div className="mb-2 flex items-start justify-between group">
        <div className="flex items-center gap-2">
          <div
            className="drag-handle p-1 -ml-1 rounded-md cursor-grab opacity-40 hover:opacity-100 hover:bg-accent/50 transition-opacity"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium">{task.title}</h3>
        </div>
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

      {/* Description removed for cleaner UI */}

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
              <Image
                src={task.assignee.image}
                alt={task.assignee.name || "User"}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
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
