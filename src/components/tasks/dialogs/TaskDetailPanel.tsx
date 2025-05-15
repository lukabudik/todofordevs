"use client";

import { TaskDetail } from "@/components/tasks/TaskDetail";

interface TaskDetailPanelProps {
  taskId: string | null;
  projectId: string;
  onClose: () => void;
  onTaskUpdate: () => void;
  initialEditMode?: boolean;
}

export function TaskDetailPanel({
  taskId,
  projectId,
  onClose,
  onTaskUpdate,
  initialEditMode = false,
}: TaskDetailPanelProps) {
  // Handle task update
  const handleTaskUpdate = async () => {
    // Call the parent's onTaskUpdate to refresh the task list
    onTaskUpdate();
  };

  return (
    <TaskDetail
      taskId={taskId}
      projectId={projectId}
      onClose={onClose}
      onTaskUpdate={handleTaskUpdate}
      onTaskDeleted={onTaskUpdate}
      initialEditMode={initialEditMode}
    />
  );
}
