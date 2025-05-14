"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
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

interface TaskDetailDialogProps {
  task: Task;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (taskId: string) => Promise<void>;
  children?: React.ReactNode;
}

export function TaskDetailDialog({
  task,
  projectId,
  open,
  onOpenChange,
  onDelete,
  children,
}: TaskDetailDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Priority colors
  const priorityColors = {
    Low: "bg-blue-500",
    Medium: "bg-yellow-500",
    High: "bg-orange-500",
    Urgent: "bg-red-500",
  };

  // Status colors
  const statusColors = {
    "To Do": "bg-gray-500",
    "In Progress": "bg-blue-500",
    Blocked: "bg-red-500",
    Done: "bg-green-500",
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString();
  };

  // Format time ago for display
  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Generate initials for assignee avatar if no image is available
  const getInitials = (assignee: Task["assignee"]) => {
    if (!assignee?.name) return "?";
    return assignee.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle task deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {task.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <TaskFormDialog
                projectId={projectId}
                mode="edit"
                task={task}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => onOpenChange(false)}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                }
              />
              <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-12 gap-4">
          {/* Left column - Task metadata */}
          <div className="col-span-4 space-y-4">
            {/* Status */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    statusColors[task.status as keyof typeof statusColors] ||
                    "bg-gray-500"
                  }`}
                />
                <span className="font-medium">{task.status}</span>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Priority
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    priorityColors[
                      task.priority as keyof typeof priorityColors
                    ] || "bg-gray-500"
                  }`}
                />
                <span className="font-medium">{task.priority}</span>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Due Date
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Assignee
              </h3>
              {task.assignee ? (
                <div className="flex items-center gap-2">
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
                      getInitials(task.assignee)
                    )}
                  </div>
                  <span>
                    {task.assignee.name || task.assignee.email || "Unknown"}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">Unassigned</span>
              )}
            </div>

            {/* Created/Updated */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Created
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTimeAgo(task.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Updated
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTimeAgo(task.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Right column - Description */}
          <div className="col-span-8">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Description
            </h3>
            {task.description ? (
              <div className="rounded-md border p-4">
                <MarkdownRenderer content={task.description} />
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md border p-4 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>No description provided</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          {task.status !== "Done" ? (
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => {
                // This would be connected to the task update API
                onOpenChange(false);
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark as Done</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => {
                // This would be connected to the task update API
                onOpenChange(false);
              }}
            >
              <span>Reopen Task</span>
            </Button>
          )}
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
