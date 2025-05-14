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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
}

export function QuickAddTaskDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
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
          console.error("Error fetching projects:", err);
          setError("Failed to load projects");
        }
      };

      fetchProjects();
    }
  }, [isOpen, projectIdFromPath]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setError("");
    }
  }, [isOpen]);

  // Focus the title input when the dialog opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the dialog is fully rendered
      const timer = setTimeout(() => {
        const titleInput = document.getElementById("quick-add-title");
        if (titleInput) {
          titleInput.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      setIsLoading(false);
      return;
    }

    if (!selectedProjectId) {
      setError("Please select a project");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/projects/${selectedProjectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority: "Medium", // Default priority
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create task");
      }

      // Close dialog and reset form
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quick Add Task</DialogTitle>
          <DialogDescription>
            Quickly add a new task to your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="quick-add-title">Task Title</Label>
            <Input
              id="quick-add-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="col-span-3"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quick-add-description">
              Description (Optional)
            </Label>
            <Textarea
              id="quick-add-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the task"
              className="col-span-3 h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quick-add-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="quick-add-status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
