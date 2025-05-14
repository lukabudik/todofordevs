"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TaskForm, TaskFormValues } from "@/components/tasks/TaskForm";

interface Project {
  id: string;
  name: string;
}

export function QuickAddDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Extract project ID from pathname if we're on a project page
  const projectIdFromPath = pathname.startsWith("/projects/")
    ? pathname.split("/")[2]
    : null;

  // Fetch projects when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const fetchProjects = async () => {
        try {
          const response = await fetch("/api/projects");
          if (!response.ok) {
            throw new Error("Failed to fetch projects");
          }
          const data = await response.json();
          setProjects(data.projects);

          // If we're on a project page, pre-select that project
          if (projectIdFromPath) {
            setSelectedProjectId(projectIdFromPath);
          } else if (data.projects.length > 0) {
            // Otherwise, select the first project
            setSelectedProjectId(data.projects[0].id);
          }
        } catch (err) {
          setError("Failed to load projects");
        }
      };

      fetchProjects();
    }
  }, [isOpen, projectIdFromPath]);

  // Reset error when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (values: TaskFormValues) => {
    if (!selectedProjectId) {
      setError("Please select a project");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${selectedProjectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create task");
      }

      // Close dialog
      onOpenChange(false);

      // Refresh the page if we're on the project page
      if (projectIdFromPath === selectedProjectId) {
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while creating the task");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quick Add Task</DialogTitle>
          <DialogDescription>
            Quickly add a new task to your project.
          </DialogDescription>
        </DialogHeader>

        {/* Project selector */}
        <div className="mb-4">
          <Label htmlFor="quick-add-project">Project</Label>
          <Select
            value={selectedProjectId || ""}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger id="quick-add-project">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!selectedProjectId && (
            <p className="mt-1 text-xs text-destructive">
              Please select a project
            </p>
          )}
        </div>

        {/* Task form */}
        {selectedProjectId && (
          <TaskForm
            projectId={selectedProjectId}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            mode="create"
            isSimplified={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
