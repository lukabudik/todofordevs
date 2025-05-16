"use client";

import {
  FolderIcon,
  LogOut,
  Monitor,
  Moon,
  Plus,
  Sun,
  Terminal,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface Project {
  id: string;
  name: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects when the command palette opens
  useEffect(() => {
    if (open && session?.user) {
      const fetchProjects = async () => {
        try {
          const response = await fetch("/api/projects");
          if (response.ok) {
            const data = await response.json();
            setProjects(data.projects || []);
          }
        } catch {
          // Silently handle error - could add error state if needed
        } finally {
          setIsLoading(false);
        }
      };

      fetchProjects();
    }
  }, [open, session?.user]);

  // Handle keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "F1") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {session?.user && (
          <>
            <CommandGroup heading="Navigation">
              <CommandItem
                onSelect={() => runCommand(() => router.push("/projects"))}
              >
                <FolderIcon className="mr-2 h-4 w-4" />
                <span>All Projects</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push("/profile"))}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Projects">
              {isLoading ? (
                <CommandItem disabled>Loading projects...</CommandItem>
              ) : projects.length === 0 ? (
                <CommandItem disabled>No projects found</CommandItem>
              ) : (
                projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() =>
                      runCommand(() => router.push(`/projects/${project.id}`))
                    }
                  >
                    <FolderIcon className="mr-2 h-4 w-4" />
                    <span>{project.name}</span>
                  </CommandItem>
                ))
              )}
              <CommandItem
                onSelect={() => {
                  runCommand(() => {
                    // Find the new project button and click it
                    const newProjectButton = document.querySelector(
                      '[data-new-project-trigger="true"]'
                    ) as HTMLButtonElement;
                    if (newProjectButton) {
                      newProjectButton.click();
                    }
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>New Project</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="CLI">
              <CommandItem
                onSelect={() => runCommand(() => window.open("/cli", "_blank"))}
              >
                <Terminal className="mr-2 h-4 w-4" />
                <span>TodoForDevs CLI</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  Command Line Tool
                </span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Actions">
              <CommandItem
                onSelect={() => {
                  runCommand(() => {
                    // Find the quick add task button and click it
                    const quickAddButton = document.querySelector(
                      '[data-quick-add-trigger="true"]'
                    ) as HTMLButtonElement;
                    if (quickAddButton) {
                      quickAddButton.click();
                    }
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>New Task</span>
                <kbd className="ml-auto text-xs">⇧N</kbd>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() => runCommand(() => setTheme("light"))}
            disabled={theme === "light"}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => setTheme("dark"))}
            disabled={theme === "dark"}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => setTheme("system"))}
            disabled={theme === "system"}
          >
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </CommandItem>
        </CommandGroup>

        {session?.user && (
          <>
            <CommandSeparator />

            <CommandGroup heading="Account">
              <CommandItem
                onSelect={() =>
                  runCommand(() => {
                    // Find the logout button and click it
                    const logoutButton = document.querySelector(
                      '[data-logout-trigger="true"]'
                    ) as HTMLButtonElement;
                    if (logoutButton) {
                      logoutButton.click();
                    }
                  })
                }
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
