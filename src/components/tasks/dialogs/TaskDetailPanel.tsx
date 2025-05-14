"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { EnhancedMarkdownEditor } from "@/components/markdown/enhanced-markdown-editor";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Clock,
  Edit,
  Save,
  X,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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

interface Collaborator {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

interface TaskDetailPanelProps {
  taskId: string | null;
  projectId: string;
  onClose: () => void;
  onTaskUpdate: () => void;
}

export function TaskDetailPanel({
  taskId,
  projectId,
  onClose,
  onTaskUpdate,
}: TaskDetailPanelProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<Task>>({});
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

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

  // Status options
  const statusOptions = ["To Do", "In Progress", "Blocked", "Done"];

  // Priority options
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];

  // Fetch task data
  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }
        const data = await response.json();

        // Extract task data from the response
        if (data.task) {
          setTask(data.task);
          setEditValues({
            title: data.task.title,
            status: data.task.status,
            priority: data.task.priority,
            dueDate: data.task.dueDate,
            description: data.task.description,
            assigneeId: data.task.assigneeId || "unassigned",
          });
        } else {
          throw new Error("Task data not found in response");
        }
      } catch (error) {
        // Silently handle error - could add error state if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Fetch collaborators
  useEffect(() => {
    if (!projectId) return;

    const fetchCollaborators = async () => {
      setIsLoadingCollaborators(true);
      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch collaborators");
        }
        const data = await response.json();
        setCollaborators(data.members || []);
      } catch (error) {
        // Silently handle error - could add error state if needed
      } finally {
        setIsLoadingCollaborators(false);
      }
    };

    fetchCollaborators();
  }, [projectId]);

  // Handle task deletion
  const handleDelete = async () => {
    if (!task) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      onClose();
      onTaskUpdate();
      router.refresh();
    } catch (error) {
      // Silently handle error - could add error state if needed
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle task update
  const handleUpdate = async () => {
    if (!task) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editValues,
          assigneeId:
            editValues.assigneeId === "unassigned"
              ? null
              : editValues.assigneeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const data = await response.json();

      // Extract task data from the response
      if (data.task) {
        setTask(data.task);
      } else {
        throw new Error("Task data not found in response");
      }
      setIsEditing(false);
      setIsEditingDescription(false);
      onTaskUpdate();
      router.refresh();
    } catch (error) {
      // Silently handle error - could add error state if needed
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof Task, value: any) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString();
    } catch (error) {
      // Silently handle error
      return "Invalid date";
    }
  };

  // Format time ago for display
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      // Silently handle error
      return "Unknown date";
    }
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

  // Mark task as done
  const markAsDone = () => {
    handleInputChange("status", "Done");
    handleUpdate();
  };

  // Reopen task
  const reopenTask = () => {
    handleInputChange("status", "To Do");
    handleUpdate();
  };

  // If no task is selected, don't render anything
  if (!taskId) return null;

  // If task is loading, show loading state
  if (isLoading && !task) {
    return (
      <div className="fixed inset-y-0 right-0 z-50 flex w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="h-6 w-48 animate-pulse rounded bg-muted"></div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            <div className="h-8 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-32 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-8 w-1/2 animate-pulse rounded bg-muted"></div>
            <div className="h-8 w-1/3 animate-pulse rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  // If task not found, show error
  if (!task) {
    return (
      <div className="fixed inset-y-0 right-0 z-50 flex w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold">Task Not Found</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Task not found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The task you're looking for doesn't exist or you don't have access
              to it.
            </p>
            <Button className="mt-4" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 flex w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out ${
        taskId ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Input
              value={editValues.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="h-9 text-lg font-semibold"
              placeholder="Task title"
            />
          ) : (
            <h2 className="text-lg font-semibold">{task.title}</h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setIsEditingDescription(false);
                  setEditValues({
                    title: task.title,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate,
                    description: task.description,
                    assigneeId: task.assigneeId || "unassigned",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleUpdate}
                disabled={isLoading}
              >
                <Save className="mr-1 h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left column - Metadata */}
          <div className="col-span-1 space-y-6">
            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              {isEditing ? (
                <Select
                  value={editValues.status || task.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              statusColors[
                                status as keyof typeof statusColors
                              ] || "bg-gray-500"
                            }`}
                          />
                          <span>{status}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      statusColors[task.status as keyof typeof statusColors] ||
                      "bg-gray-500"
                    }`}
                  />
                  <span className="font-medium">{task.status}</span>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Priority
              </h3>
              {isEditing ? (
                <Select
                  value={editValues.priority || task.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              priorityColors[
                                priority as keyof typeof priorityColors
                              ] || "bg-gray-500"
                            }`}
                          />
                          <span>{priority}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
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
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Due Date
              </h3>
              {isEditing ? (
                <Input
                  type="date"
                  value={
                    editValues.dueDate
                      ? (() => {
                          try {
                            const date = new Date(editValues.dueDate);
                            if (isNaN(date.getTime())) {
                              return "";
                            }
                            return date.toISOString().split("T")[0];
                          } catch (error) {
                            // Silently handle error
                            return "";
                          }
                        })()
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("dueDate", e.target.value || null)
                  }
                  className="w-full"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Assignee
              </h3>
              {isEditing ? (
                <Select
                  value={editValues.assigneeId || "unassigned"}
                  onValueChange={(value) =>
                    handleInputChange("assigneeId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {isLoadingCollaborators ? (
                      <SelectItem value="loading" disabled>
                        Loading collaborators...
                      </SelectItem>
                    ) : (
                      collaborators.map((collaborator) => (
                        <SelectItem
                          key={collaborator.id}
                          value={collaborator.id}
                        >
                          {collaborator.name || collaborator.email || "Unknown"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              ) : task.assignee ? (
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
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Created
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTimeAgo(task.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Updated
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTimeAgo(task.updatedAt)}</span>
              </div>
            </div>

            {/* Mark as Done / Reopen */}
            {!isEditing && (
              <div className="pt-4">
                {task.status !== "Done" ? (
                  <Button
                    variant="outline"
                    className="w-full gap-1"
                    onClick={markAsDone}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mark as Done</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full gap-1"
                    onClick={reopenTask}
                  >
                    <span>Reopen Task</span>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right column - Description */}
          <div className="col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Description
              </h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    setIsEditingDescription(true);
                  }}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit Description
                </Button>
              )}
            </div>

            {isEditing && isEditingDescription ? (
              <EnhancedMarkdownEditor
                value={editValues.description || ""}
                onChange={(value) => handleInputChange("description", value)}
                placeholder="Write a description for this task..."
                minHeight="300px"
              />
            ) : task.description ? (
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
      </div>
    </div>
  );
}
