"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, FolderIcon, PlusIcon, Settings } from "lucide-react";

interface Project {
  id: string;
  name: string;
  ownerId: string;
}

export function ProjectSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

  // Extract project ID from pathname if we're on a project page
  const projectIdFromPath = pathname.startsWith("/projects/")
    ? pathname.split("/")[2]
    : null;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);

        // If we're on a project page, find the current project
        if (projectIdFromPath) {
          const current = data.projects.find(
            (p: Project) => p.id === projectIdFromPath
          );
          if (current) {
            setCurrentProject(current);
          }
        } else {
          setCurrentProject(null);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [pathname, projectIdFromPath]);

  // Handle keyboard shortcut (Alt+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "p") {
        // Find the dropdown trigger button and click it
        const trigger = document.getElementById("project-switcher-trigger");
        if (trigger) {
          trigger.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id="project-switcher-trigger"
            variant="outline"
            className="flex items-center gap-2 px-3"
          >
            <FolderIcon className="h-4 w-4" />
            <span className="max-w-[150px] truncate">
              {currentProject ? currentProject.name : "Projects"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem asChild>
            <Link
              href="/projects"
              className="flex cursor-pointer items-center gap-2"
            >
              <span>All Projects</span>
            </Link>
          </DropdownMenuItem>

          {projects.length > 0 && <DropdownMenuSeparator />}

          {isLoading ? (
            <DropdownMenuItem disabled>Loading projects...</DropdownMenuItem>
          ) : error ? (
            <DropdownMenuItem disabled className="text-destructive">
              {error}
            </DropdownMenuItem>
          ) : projects.length === 0 ? (
            <DropdownMenuItem disabled>No projects yet</DropdownMenuItem>
          ) : (
            projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                asChild
                className={
                  currentProject?.id === project.id ? "bg-accent/50" : ""
                }
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="flex w-full cursor-pointer items-center justify-between"
                >
                  <span className="truncate">{project.name}</span>
                  {currentProject?.id === project.id && (
                    <Link
                      href={`/projects/${project.id}/settings`}
                      onClick={(e) => e.stopPropagation()}
                      className="ml-2 flex h-6 w-6 items-center justify-center rounded-full hover:bg-accent"
                    >
                      <Settings className="h-3 w-3" />
                    </Link>
                  )}
                </Link>
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsNewProjectDialogOpen(true)}
            className="flex cursor-pointer items-center gap-2 text-primary"
            data-new-project-trigger="true"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom implementation of project creation dialog */}
      <Dialog
        open={isNewProjectDialogOpen}
        onOpenChange={setIsNewProjectDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new project. You can add tasks and invite
              collaborators later.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get("name") as string;

              if (!name.trim()) {
                return;
              }

              try {
                const response = await fetch("/api/projects", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ name }),
                });

                if (!response.ok) {
                  throw new Error("Failed to create project");
                }

                const data = await response.json();

                // Close dialog and refresh projects
                setIsNewProjectDialogOpen(false);
                router.refresh();

                // Navigate to the new project
                router.push(`/projects/${data.project.id}`);
              } catch (err) {
                console.error("Error creating project:", err);
              }
            }}
            className="space-y-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-left">
                Project Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="My Awesome Project"
                className="col-span-3"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewProjectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
