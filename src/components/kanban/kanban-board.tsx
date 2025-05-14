"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { Button } from "@/components/ui/button";
import { ListFilter, LayoutGrid, List } from "lucide-react";
import { TaskDetailPanel } from "@/components/tasks/dialogs/TaskDetailPanel";

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

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
  onTaskUpdate: (taskId: string, data: Partial<Task>) => Promise<void>;
  onViewChange: (view: "list" | "board") => void;
  currentView: "list" | "board";
}

export function KanbanBoard({
  tasks,
  projectId,
  onTaskUpdate,
  onViewChange,
  currentView,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [activeOverId, setActiveOverId] = useState<string | null>(null);

  // Define the statuses for the columns
  const statuses = ["To Do", "In Progress", "Blocked", "Done"];

  // Group tasks by status
  const tasksByStatus = statuses.reduce<Record<string, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  // Configure sensors for drag and drop with improved settings
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Reduce activation constraints to make dragging easier
      activationConstraint: {
        distance: 3, // Minimal distance required to start dragging
        delay: 0, // No delay before dragging starts
        tolerance: 0, // No tolerance needed
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Custom drop animation configuration
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  // Handle drag start with enhanced feedback
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    setActiveId(id);

    // Find the task being dragged to display in the overlay
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setActiveTask(task);
    }
  };

  // Handle drag over (for moving between columns)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveOverId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Update the active over id for the overlay
    setActiveOverId(overId);

    // Find the task being dragged
    const activeTask = tasks.find((task) => task.id === activeId);

    // If we're not dragging over a column or the task isn't found, return
    if (!activeTask || !statuses.includes(overId)) return;

    // If the task is already in this status column, no need to update
    if (activeTask.status === overId) return;

    // Update the task status
    onTaskUpdate(activeId, { status: overId });
  };

  // Handle drag end (for reordering within a column)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset all drag-related state
    setActiveId(null);
    setActiveTask(null);
    setActiveOverId(null);

    if (!over) return;

    // Add a small delay to allow the drop animation to complete
    // This makes the transition feel more natural
    setTimeout(() => {
      // In the future, we could implement task reordering within columns
      // by adding a position/order field to tasks and updating it here
    }, 150);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 select-none">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-4">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status] || []}
                projectId={projectId}
                onTaskClick={(taskId) => {
                  setSelectedTaskId(taskId);
                  setOpenInEditMode(false);
                }}
                onEditClick={(taskId) => {
                  setSelectedTaskId(taskId);
                  setOpenInEditMode(true);
                }}
                onTaskUpdate={onTaskUpdate}
              />
            ))}
          </div>

          {/* Drag overlay for improved visual feedback */}
          <DragOverlay
            dropAnimation={dropAnimation}
            modifiers={[
              // Add a slight rotation to the dragged item for a more natural feel
              ({ transform }) => ({
                ...transform,
                scaleX: 1.05,
                scaleY: 1.05,
                rotate: 1,
              }),
            ]}
          >
            {activeTask ? (
              <div
                className="w-72 rounded-md border-2 border-primary/30 bg-card p-3 shadow-xl opacity-95"
                style={{
                  transformOrigin: "0 0",
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="mb-2 flex items-start gap-2">
                  <div className="flex items-center gap-2 w-full">
                    <div className="p-1 rounded-md cursor-grabbing">
                      <div className="h-4 w-1 bg-primary/30 rounded-full mb-1"></div>
                      <div className="h-4 w-1 bg-primary/30 rounded-full"></div>
                    </div>
                    <h3 className="text-base font-medium">
                      {activeTask.title}
                    </h3>
                  </div>
                </div>
                {/* Description removed for cleaner UI */}
                <div className="mt-2 text-xs text-primary/70 font-medium pl-6">
                  Moving to: {activeOverId || "..."}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        taskId={selectedTaskId}
        projectId={projectId}
        onClose={() => {
          setSelectedTaskId(null);
          setOpenInEditMode(false);
        }}
        onTaskUpdate={() => {
          // Refresh the task list
          window.location.reload();
        }}
        initialEditMode={openInEditMode}
      />
    </div>
  );
}
