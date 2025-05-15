"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NewProjectDialog } from "@/components/projects/new-project-dialog";

interface Project {
  id: string;
  name: string;
  ownerId: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch {
        setError("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <NewProjectDialog />
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/projects"
              className={`flex items-center rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                pathname === "/projects"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : ""
              }`}
            >
              All Projects
            </Link>
          </li>

          {isLoading ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Loading projects...
            </li>
          ) : error ? (
            <li className="px-3 py-2 text-sm text-destructive">{error}</li>
          ) : projects.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No projects yet
            </li>
          ) : (
            projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className={`flex items-center rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    pathname === `/projects/${project.id}`
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`}
                >
                  {project.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </nav>
    </aside>
  );
}
