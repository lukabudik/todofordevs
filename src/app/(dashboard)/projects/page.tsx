"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewProjectDialog } from "@/components/projects/new-project-dialog";
import { ProjectOptions } from "@/components/projects/project-options";

interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
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
        setError("Error loading projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <NewProjectDialog />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No projects yet</h2>
          <p className="mb-6 text-muted-foreground">
            Create your first project to get started
          </p>
          <NewProjectDialog />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <ProjectOptions project={project} />
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Created on{" "}
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <Link
                href={`/projects/${project.id}`}
                className="mt-auto flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <span>View tasks</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
