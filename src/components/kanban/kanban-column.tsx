"use client";

import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanTask } from "./kanban-task";

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
}

export function KanbanColumn({
  status,
  tasks,
  projectId,
  onTaskClick,
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

  // Status colors - only for the indicator dot
  const statusColors = {
    "To Do": "bg-gray-500",
    "In Progress": "bg-blue-500",
    Blocked: "bg-red-500",
    Done: "bg-green-500",
  };

  // Status icons
  const statusIcons = {
    "To Do": "📋",
    "In Progress": "🔄",
    Blocked: "🚫",
    Done: "✅",
  };

  // Get color for current status
  const statusColor =
    statusColors[status as keyof typeof statusColors] || "bg-gray-500";

  // Get icon for current status
  const statusIcon = statusIcons[status as keyof typeof statusIcons] || "📋";

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
        <div className={`h-3 w-3 rounded-full ${statusColor}`} />
        <h3 className="text-lg font-semibold text-foreground">
          {statusIcon} {status}
        </h3>
        <div className="ml-auto rounded-full bg-muted px-2 py-1 text-xs font-medium">
          {tasks.length}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto rounded-md p-2 transition-colors duration-200 select-none ${
          isOver ? "bg-accent/30" : "bg-muted/50"
        }`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              No tasks
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanTask
                key={task.id}
                task={task}
                projectId={projectId}
                onTaskClick={onTaskClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
