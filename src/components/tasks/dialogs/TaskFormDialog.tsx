"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TaskForm, TaskFormValues } from "@/components/tasks/TaskForm";

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

  // Fetch collaborators from API
  const fetchCollaborators = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);

      if (!response.ok) {
        throw new Error("Failed to fetch collaborators");
      }

      const data = await response.json();
      setCollaborators(data.members || []);
    } catch {
      // Silently handle error - could add error state if needed
    }
  }, [projectId]);

  // Fetch collaborators when dialog opens
  useEffect(() => {
    if (open) {
      fetchCollaborators();
    }
  }, [open, fetchCollaborators]);

  const handleSubmit = async (values: TaskFormValues) => {
    setIsLoading(true);
    setError("");

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
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${mode} task`);
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

  const handleCancel = () => {
    setError("");
    setOpen(false);
  };

  const dialogTitle = mode === "create" ? "Create New Task" : "Edit Task";
  const dialogDescription =
    mode === "create"
      ? "Add a new task to your project. You can include details like description, status, priority, and due date."
      : "Update the details of your task.";

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
        <TaskForm
          initialValues={task}
          collaborators={collaborators}
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
}
