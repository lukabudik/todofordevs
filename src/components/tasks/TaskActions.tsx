"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CircleDashed,
  CircleEllipsis,
  MoreHorizontal,
  Pencil,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  projectId: string;
  assigneeId: string | null;
}

interface Collaborator {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

interface TaskActionsProps {
  task: Task;
  collaborators?: Collaborator[];
  variant?: "dropdown" | "toolbar";
  onTaskUpdate?: (taskId: string, data: Partial<Task>) => Promise<void>;
  showStatusChange?: boolean;
  showPriorityChange?: boolean;
  showAssigneeChange?: boolean;
  showDueDateChange?: boolean;
  onEditClick?: (taskId: string) => void;
}

export function TaskActions({
  task,
  collaborators = [],
  variant = "dropdown",
  onTaskUpdate,
  showStatusChange = true,
  showPriorityChange = true,
  showAssigneeChange = true,
  showDueDateChange = true,
  onEditClick,
}: TaskActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Status options with icons
  const statusOptions = [
    {
      value: "To Do",
      label: "To Do",
      icon: <CircleDashed className="h-4 w-4 text-gray-500" />,
    },
    {
      value: "In Progress",
      label: "In Progress",
      icon: <CircleEllipsis className="h-4 w-4 text-blue-500" />,
    },
    {
      value: "Blocked",
      label: "Blocked",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    },
    {
      value: "Done",
      label: "Done",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
  ];

  // Priority options with colors
  const priorityOptions = [
    { value: "Low", label: "Low", color: "text-blue-500" },
    { value: "Medium", label: "Medium", color: "text-yellow-500" },
    { value: "High", label: "High", color: "text-orange-500" },
    { value: "Urgent", label: "Urgent", color: "text-red-500" },
  ];

  // Due date options
  const dueDateOptions = [
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "next_week", label: "Next Week" },
    { value: "no_date", label: "No Due Date" },
    { value: "custom", label: "Custom Date..." },
  ];

  // Handle task deletion
  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete task");
      }

      // Close dialog and refresh
      setShowDeleteDialog(false);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while deleting the task");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!onTaskUpdate || newStatus === task.status) return;

    try {
      await onTaskUpdate(task.id, { status: newStatus });
    } catch {
      // Error handling is managed by the parent component
    }
  };

  // Handle priority change
  const handlePriorityChange = async (newPriority: string) => {
    if (!onTaskUpdate || newPriority === task.priority) return;

    try {
      await onTaskUpdate(task.id, { priority: newPriority });
    } catch {
      // Error handling is managed by the parent component
    }
  };

  // Handle assignee change
  const handleAssigneeChange = async (newAssigneeId: string) => {
    if (!onTaskUpdate || newAssigneeId === task.assigneeId) return;

    try {
      await onTaskUpdate(task.id, {
        assigneeId: newAssigneeId === "unassigned" ? null : newAssigneeId,
      });
    } catch {
      // Error handling is managed by the parent component
    }
  };

  // Handle due date change
  const handleDueDateChange = async (option: string) => {
    if (!onTaskUpdate) return;

    let newDueDate: string | null = null;
    const today = new Date();

    switch (option) {
      case "today":
        newDueDate = format(today, "yyyy-MM-dd");
        break;
      case "tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        newDueDate = format(tomorrow, "yyyy-MM-dd");
        break;
      case "next_week":
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        newDueDate = format(nextWeek, "yyyy-MM-dd");
        break;
      case "no_date":
        newDueDate = null;
        break;
      case "custom":
        // This would ideally open a date picker
        // For now, we'll just keep the current date
        return;
      default:
        return;
    }

    try {
      await onTaskUpdate(task.id, { dueDate: newDueDate });
    } catch {
      // Error handling is managed by the parent component
    }
  };

  // Render dropdown menu variant
  if (variant === "dropdown") {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Task actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Edit action */}
            <DropdownMenuItem
              onClick={() => onEditClick && onEditClick(task.id)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Task
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Status change */}
            {showStatusChange && onTaskUpdate && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <CircleDashed className="mr-2 h-4 w-4" />
                  <span>Change Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={task.status}
                    onValueChange={handleStatusChange}
                  >
                    {statusOptions.map((status) => (
                      <DropdownMenuRadioItem
                        key={status.value}
                        value={status.value}
                        className="flex items-center"
                      >
                        {status.icon}
                        <span className="ml-2">{status.label}</span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            {/* Priority change */}
            {showPriorityChange && onTaskUpdate && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Change Priority</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={task.priority}
                    onValueChange={handlePriorityChange}
                  >
                    {priorityOptions.map((priority) => (
                      <DropdownMenuRadioItem
                        key={priority.value}
                        value={priority.value}
                        className="flex items-center"
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${priority.color.replace(
                            "text-",
                            "bg-"
                          )}`}
                        />
                        <span className={`ml-2 ${priority.color}`}>
                          {priority.label}
                        </span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            {/* Assignee change */}
            {showAssigneeChange && onTaskUpdate && collaborators.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <span>Assign To</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={task.assigneeId || "unassigned"}
                    onValueChange={handleAssigneeChange}
                  >
                    <DropdownMenuRadioItem value="unassigned">
                      Unassigned
                    </DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                    {collaborators.map((collaborator) => (
                      <DropdownMenuRadioItem
                        key={collaborator.id}
                        value={collaborator.id}
                      >
                        {collaborator.name || collaborator.email || "Unknown"}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            {/* Due date change */}
            {showDueDateChange && onTaskUpdate && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Set Due Date</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {dueDateOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleDueDateChange(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            <DropdownMenuSeparator />

            {/* Delete action */}
            <DropdownMenuItem
              onClick={() => {
                setError("");
                setShowDeleteDialog(true);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Render toolbar variant
  return (
    <div className="flex items-center gap-1">
      {/* Status change button */}
      {showStatusChange && onTaskUpdate && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              {statusOptions.find((s) => s.value === task.status)?.icon}
              <span className="sr-only md:not-sr-only">{task.status}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={task.status}
              onValueChange={handleStatusChange}
            >
              {statusOptions.map((status) => (
                <DropdownMenuRadioItem
                  key={status.value}
                  value={status.value}
                  className="flex items-center"
                >
                  {status.icon}
                  <span className="ml-2">{status.label}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Priority change button */}
      {showPriorityChange && onTaskUpdate && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Tag className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">{task.priority}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={task.priority}
              onValueChange={handlePriorityChange}
            >
              {priorityOptions.map((priority) => (
                <DropdownMenuRadioItem
                  key={priority.value}
                  value={priority.value}
                  className="flex items-center"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${priority.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                  />
                  <span className={`ml-2 ${priority.color}`}>
                    {priority.label}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Assignee change button */}
      {showAssigneeChange && onTaskUpdate && collaborators.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <User className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">
                {task.assigneeId
                  ? collaborators.find((c) => c.id === task.assigneeId)?.name ||
                    "Assigned"
                  : "Unassigned"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={task.assigneeId || "unassigned"}
              onValueChange={handleAssigneeChange}
            >
              <DropdownMenuRadioItem value="unassigned">
                Unassigned
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {collaborators.map((collaborator) => (
                <DropdownMenuRadioItem
                  key={collaborator.id}
                  value={collaborator.id}
                >
                  {collaborator.name || collaborator.email || "Unknown"}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Due date change button */}
      {showDueDateChange && onTaskUpdate && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Calendar className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">
                {task.dueDate
                  ? format(new Date(task.dueDate), "MMM d")
                  : "No date"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {dueDateOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleDueDateChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Edit button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1"
        onClick={() => onEditClick && onEditClick(task.id)}
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only md:not-sr-only">Edit</span>
      </Button>

      {/* More actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setError("");
              setShowDeleteDialog(true);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
