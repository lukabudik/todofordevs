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
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuShortcut,
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
import {
  ChevronDown,
  FolderIcon,
  PlusIcon,
  Settings,
  Clock,
  CheckIcon,
  FolderOpen,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Get recent projects (last 3 accessed)
  const recentProjects = [...projects]
    .sort((a, b) => {
      // If current project, put it first
      if (a.id === currentProject?.id) return -1;
      if (b.id === currentProject?.id) return 1;
      return 0;
    })
    .slice(0, 3);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id="project-switcher-trigger"
            variant={currentProject ? "default" : "outline"}
            className={cn(
              "flex h-9 items-center gap-2 px-4 py-2 transition-all",
              currentProject && "bg-primary text-primary-foreground"
            )}
          >
            {currentProject ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <FolderIcon className="h-4 w-4" />
            )}
            <span className="max-w-[180px] truncate font-medium">
              {currentProject ? currentProject.name : "Select Project"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Switch Project
            <DropdownMenuShortcut>Alt+P</DropdownMenuShortcut>
          </DropdownMenuLabel>

          {/* Recent projects section */}
          {recentProjects.length > 0 && (
            <DropdownMenuGroup>
              {recentProjects.map((project) => (
                <DropdownMenuItem
                  key={`recent-${project.id}`}
                  asChild
                  className={cn(
                    "flex items-center py-2",
                    currentProject?.id === project.id && "bg-accent/50"
                  )}
                >
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex w-full cursor-pointer items-center gap-2"
                  >
                    {currentProject?.id === project.id ? (
                      <CheckIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <FolderIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate">{project.name}</span>
                    {currentProject?.id === project.id && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          router.push(`/projects/${project.id}/settings`);
                        }}
                        className="ml-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-accent"
                      >
                        <Settings className="h-3 w-3" />
                      </span>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}

          <DropdownMenuSeparator />

          {/* All projects section */}
          <DropdownMenuItem asChild className="py-2">
            <Link
              href="/projects"
              className="flex cursor-pointer items-center gap-2"
            >
              <Home className="h-4 w-4 text-muted-foreground" />
              <span>All Projects</span>
            </Link>
          </DropdownMenuItem>

          {projects.length > 0 && <DropdownMenuSeparator />}

          {/* Projects list */}
          {isLoading ? (
            <DropdownMenuItem disabled>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Loading projects...</span>
              </div>
            </DropdownMenuItem>
          ) : error ? (
            <DropdownMenuItem disabled className="text-destructive">
              {error}
            </DropdownMenuItem>
          ) : projects.length === 0 ? (
            <DropdownMenuItem disabled>No projects yet</DropdownMenuItem>
          ) : (
            <DropdownMenuGroup>
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  asChild
                  className={cn(
                    "py-2",
                    currentProject?.id === project.id && "bg-accent/50"
                  )}
                >
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex w-full cursor-pointer items-center gap-2"
                  >
                    {currentProject?.id === project.id ? (
                      <CheckIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <FolderIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate">{project.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}

          <DropdownMenuSeparator />

          {/* Create new project */}
          <DropdownMenuItem
            onClick={() => setIsNewProjectDialogOpen(true)}
            className="flex cursor-pointer items-center gap-2 py-2 text-primary"
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
                // Handle error silently - could add error state if needed
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
