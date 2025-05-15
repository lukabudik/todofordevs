"use client";

import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanTask } from "./kanban-task";
import {
  CircleDashed,
  CircleEllipsis,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

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

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
  projectId: string;
  onTaskClick: (taskId: string) => void;
  onEditClick: (taskId: string) => void;
  onTaskUpdate?: (taskId: string, data: Partial<Task>) => Promise<void>;
}

export function KanbanColumn({
  status,
  tasks,
  projectId,
  onTaskClick,
  onEditClick,
  onTaskUpdate,
}: KanbanColumnProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: status,
  });

  // Add animation state for when a task is dropped
  const [isDropAnimating, setIsDropAnimating] = useState(false);

  // Trigger animation when a task is dropped into this column
  useEffect(() => {
    if (isOver && active) {
      // When dragging over, prepare for potential drop
    } else if (
      !isOver &&
      active &&
      tasks.some((task) => task.id === active.id)
    ) {
      // When a task was just dropped into this column (no longer over but task exists)
      setIsDropAnimating(true);
      const timer = setTimeout(() => setIsDropAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOver, active, tasks]);

  // Status icons
  const statusIcons = {
    "To Do": <CircleDashed className="h-5 w-5 text-gray-500" />,
    "In Progress": <CircleEllipsis className="h-5 w-5 text-blue-500" />,
    Blocked: <AlertCircle className="h-5 w-5 text-red-500" />,
    Done: <CheckCircle className="h-5 w-5 text-green-500" />,
  };

  // Get icon for current status
  const statusIcon = statusIcons[status as keyof typeof statusIcons] || (
    <CircleDashed className="h-5 w-5 text-gray-500" />
  );

  return (
    <div
      className={`flex h-full w-72 flex-col rounded-md border bg-card p-2 shadow-sm transition-all duration-200 select-none ${
        isOver
          ? "ring-2 ring-primary scale-[1.02] shadow-md"
          : isDropAnimating
            ? "bg-accent/20 scale-[1.01]"
            : ""
      }`}
    >
      <div className="mb-3 flex items-center gap-2 p-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          {statusIcon}
          <span>{status}</span>
        </h3>
        <div className="ml-auto rounded-full bg-muted px-2 py-1 text-xs font-medium">
          {tasks.length}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto rounded-md p-2 transition-all duration-200 select-none ${
          isOver
            ? "bg-accent/30 ring-2 ring-primary/50 ring-inset"
            : "bg-muted/50"
        }`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div
              className={`flex h-20 items-center justify-center rounded-md border-2 border-dashed p-4 text-center text-sm ${
                isOver
                  ? "border-primary/50 text-primary/70 animate-pulse"
                  : "border-muted text-muted-foreground"
              }`}
            >
              {isOver ? "Drop here" : "No tasks"}
            </div>
          ) : (
            <>
              {/* Drop indicator above tasks - only shown when dragging over */}
              {isOver && (
                <div className="h-1 w-full border-t-2 border-dashed border-primary/50 my-2 rounded-full"></div>
              )}
              {tasks.map((task) => (
                <KanbanTask
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onTaskClick={onTaskClick}
                  onEditClick={onEditClick}
                  onTaskUpdate={onTaskUpdate}
                />
              ))}
            </>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
