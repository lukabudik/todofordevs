"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnhancedMarkdownEditor } from "@/components/markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";

interface Collaborator {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

interface TaskFormDialogProps {
  projectId: string;
  mode: "create" | "edit";
  task?: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: string | null;
    assigneeId: string | null;
  };
  trigger?: React.ReactNode;
}

export function TaskFormDialog({
  projectId,
  mode,
  task,
  trigger,
}: TaskFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(false);

  // Form state
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "To Do");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.split("T")[0] : ""
  );
  const [assigneeId, setAssigneeId] = useState(
    task?.assigneeId || "unassigned"
  );

  // Fetch collaborators when dialog opens
  useEffect(() => {
    if (open) {
      fetchCollaborators();
    }
  }, [open, projectId]);

  // Fetch collaborators from API
  const fetchCollaborators = async () => {
    setIsLoadingCollaborators(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);

      if (!response.ok) {
        throw new Error("Failed to fetch collaborators");
      }

      const data = await response.json();
      setCollaborators(data.members || []);
    } catch (err) {
      // Silently handle error - could add error state if needed
    } finally {
      setIsLoadingCollaborators(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      setIsLoading(false);
      return;
    }

    try {
      const url =
        mode === "create"
          ? `/api/projects/${projectId}/tasks`
          : `/api/tasks/${task?.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority,
          dueDate: dueDate || null,
          assigneeId: assigneeId === "unassigned" ? null : assigneeId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${mode} task`);
      }

      // Reset form and close dialog
      if (mode === "create") {
        setTitle("");
        setDescription("");
        setStatus("To Do");
        setPriority("Medium");
        setDueDate("");
        setAssigneeId("unassigned");
      }

      setOpen(false);

      // Refresh the page to show the updated task list
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          `An error occurred while ${
            mode === "create" ? "creating" : "updating"
          } the task`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const dialogTitle = mode === "create" ? "Create New Task" : "Edit Task";
  const dialogDescription =
    mode === "create"
      ? "Add a new task to your project. You can include details like description, status, priority, and due date."
      : "Update the details of your task.";
  const submitButtonText =
    mode === "create"
      ? isLoading
        ? "Creating..."
        : "Create Task"
      : isLoading
        ? "Saving..."
        : "Save Changes";

  const defaultTrigger =
    mode === "create" ? (
      <Button className="gap-1">
        <PlusIcon className="h-4 w-4" />
        <span>New Task</span>
      </Button>
    ) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-left">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                placeholder="Task title"
                className="col-span-3"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-left">
                Description
              </Label>
              <EnhancedMarkdownEditor
                value={description}
                onChange={setDescription}
                placeholder="Task description (supports Markdown)"
                minHeight="200px"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status" className="text-left">
                  Status
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority" className="text-left">
                  Priority
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate" className="text-left">
                Due Date (Optional)
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDueDate(e.target.value)
                }
                className="col-span-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignee" className="text-left">
                Assignee (Optional)
              </Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {isLoadingCollaborators ? (
                    <SelectItem value="loading" disabled>
                      Loading collaborators...
                    </SelectItem>
                  ) : (
                    collaborators.map((collaborator) => (
                      <SelectItem key={collaborator.id} value={collaborator.id}>
                        {collaborator.name || collaborator.email || "Unknown"}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (mode === "create") {
                  setTitle("");
                  setDescription("");
                  setStatus("To Do");
                  setPriority("Medium");
                  setDueDate("");
                } else {
                  setTitle(task?.title || "");
                  setDescription(task?.description || "");
                  setStatus(task?.status || "To Do");
                  setPriority(task?.priority || "Medium");
                  setDueDate(task?.dueDate ? task.dueDate.split("T")[0] : "");
                  setAssigneeId(task?.assigneeId || "unassigned");
                }
                setError("");
                setOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
