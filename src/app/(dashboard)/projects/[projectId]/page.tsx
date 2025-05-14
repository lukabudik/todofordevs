"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectOptions } from "@/components/projects/project-options";
import { ProjectCollaborators } from "@/components/projects/project-collaborators";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskOptions } from "@/components/tasks/task-options";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { useSession } from "next-auth/react";

interface Project {
  id: string;
  name: string;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assigneeId: string | null;
  assignee: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: session } = useSession();

  const [project, setProject] = useState<Project | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [collaborators, setCollaborators] = useState<
    Array<{
      id: string;
      name: string | null;
      email: string | null;
      role: string;
    }>
  >([]);

  // Task filtering and sorting state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = await response.json();
        setProject(data.project);

        // Check if current user is the project owner
        if (session?.user?.id && data.project.ownerId === session.user.id) {
          setIsOwner(true);
        }
      } catch (err) {
        setError("Error loading project. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, session?.user?.id]);

  // Fetch project collaborators
  useEffect(() => {
    const fetchCollaborators = async () => {
      if (!projectId) return;

      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch collaborators");
        }

        const data = await response.json();
        setCollaborators(data.members || []);
      } catch (err) {
        console.error("Error fetching collaborators:", err);
      }
    };

    fetchCollaborators();
  }, [projectId]);

  // Filter and sort tasks
  const filteredTasks =
    project?.tasks.filter((task) => {
      if (statusFilter && task.status !== statusFilter) return false;
      if (priorityFilter && task.priority !== priorityFilter) return false;
      if (assigneeFilter) {
        if (assigneeFilter === "unassigned" && task.assigneeId !== null)
          return false;
        if (
          assigneeFilter !== "unassigned" &&
          task.assigneeId !== assigneeFilter
        )
          return false;
      }
      return true;
    }) || [];

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aValue = a[sortBy as keyof Task];
    const bValue = b[sortBy as keyof Task];

    // Handle null values
    if (aValue === null) return sortOrder === "asc" ? -1 : 1;
    if (bValue === null) return sortOrder === "asc" ? 1 : -1;

    // Handle date comparisons
    if (
      typeof aValue === "string" &&
      (sortBy === "dueDate" || sortBy === "createdAt" || sortBy === "updatedAt")
    ) {
      return sortOrder === "asc"
        ? new Date(aValue).getTime() - new Date(bValue as string).getTime()
        : new Date(bValue as string).getTime() - new Date(aValue).getTime();
    }

    // Handle string comparisons
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          Project not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            Owned by {project.owner.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProjectCollaborators projectId={projectId} isOwner={isOwner} />
          <TaskFormDialog projectId={projectId} mode="create" />
          <ProjectOptions project={project} />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        {/* Status Filter */}
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>
          <select
            value={priorityFilter || ""}
            onChange={(e) => setPriorityFilter(e.target.value || null)}
            className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="mb-1 block text-sm font-medium">Assignee</label>
          <select
            value={assigneeFilter || ""}
            onChange={(e) => setAssigneeFilter(e.target.value || null)}
            className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {collaborators.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name || collaborator.email || "Unknown"}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="mb-1 block text-sm font-medium">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="mb-1 block text-sm font-medium">Order</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No tasks found</h2>
          <p className="mb-6 text-muted-foreground">
            {filteredTasks.length === 0 && project.tasks.length > 0
              ? "No tasks match your filters. Try adjusting your filter criteria."
              : "This project doesn't have any tasks yet. Create your first task to get started."}
          </p>
          <TaskFormDialog projectId={projectId} mode="create" />
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50 sm:p-6"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        priorityColors[
                          task.priority as keyof typeof priorityColors
                        ] || "bg-gray-500"
                      }`}
                    />
                    <span className="text-xs font-medium">{task.priority}</span>
                  </div>
                  <TaskOptions
                    task={{
                      ...task,
                      projectId,
                      assigneeId: task.assigneeId,
                    }}
                  />
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center">
                  <div
                    className={`mr-2 h-2 w-2 rounded-full ${
                      statusColors[task.status as keyof typeof statusColors] ||
                      "bg-gray-500"
                    }`}
                  />
                  <span className="text-sm">{task.status}</span>
                </div>

                {task.dueDate && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Due: </span>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}

                {task.assignee ? (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Assigned to: </span>
                    {task.assignee.name}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Unassigned
                  </div>
                )}
              </div>

              {task.description && (
                <div className="mb-4">
                  <MarkdownRenderer
                    content={
                      task.description.length > 300
                        ? `${task.description.substring(0, 300)}...`
                        : task.description
                    }
                  />
                </div>
              )}

              <div className="mt-auto text-xs text-muted-foreground">
                Updated {new Date(task.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
