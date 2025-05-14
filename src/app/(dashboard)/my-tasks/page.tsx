"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { TaskOptions } from "@/components/tasks/task-options";
import { EnhancedFilters } from "@/components/tasks/filters";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assigneeId: string | null;
}

interface Project {
  id: string;
  name: string;
  ownerId: string;
}

interface ProjectWithTasks {
  project: Project;
  tasks: Task[];
}

export default function MyTasksPage() {
  const router = useRouter();
  const [projectsWithTasks, setProjectsWithTasks] = useState<
    ProjectWithTasks[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtering and sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null);
  const [showNoAssignee, setShowNoAssignee] = useState(false);
  const [showNoDueDate, setShowNoDueDate] = useState(false);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Handle filter changes from EnhancedFilters component
  const handleFiltersChange = useCallback(
    (filters: {
      searchQuery: string;
      statusFilter: string | null;
      priorityFilter: string | null;
      assigneeFilter: string | null;
      dueDateFilter: string | null;
      showNoAssignee: boolean;
      showNoDueDate: boolean;
    }) => {
      setSearchQuery(filters.searchQuery);
      setStatusFilter(filters.statusFilter);
      setPriorityFilter(filters.priorityFilter);
      setDueDateFilter(filters.dueDateFilter);
      setShowNoAssignee(filters.showNoAssignee);
      setShowNoDueDate(filters.showNoDueDate);
    },
    []
  );

  // Handle sort changes from EnhancedFilters component
  const handleSortChange = useCallback(
    (newSortBy: string, newSortOrder: string) => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    },
    []
  );

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const response = await fetch("/api/user/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setProjectsWithTasks(data.tasksByProject || []);
      } catch (err) {
        setError("Error loading tasks. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  // Apply all filters to tasks
  const filteredProjectsWithTasks = projectsWithTasks.map(
    (projectWithTasks) => ({
      ...projectWithTasks,
      tasks: projectWithTasks.tasks.filter((task) => {
        // Text search filter
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          const titleMatch = task.title.toLowerCase().includes(searchLower);
          const descriptionMatch = task.description
            ? task.description.toLowerCase().includes(searchLower)
            : false;

          if (!titleMatch && !descriptionMatch) return false;
        }

        // Status filter
        if (statusFilter && task.status !== statusFilter) return false;

        // Priority filter
        if (priorityFilter && task.priority !== priorityFilter) return false;

        // Assignee filter (for My Tasks, all tasks are assigned to the current user)
        if (showNoAssignee) return false; // No unassigned tasks in My Tasks view

        // Due date filter
        if (showNoDueDate && task.dueDate !== null) return false;
        if (dueDateFilter) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;

          if (dueDateFilter === "Today") {
            if (!taskDueDate) return false;

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (taskDueDate < today || taskDueDate >= tomorrow) return false;
          } else if (dueDateFilter === "This Week") {
            if (!taskDueDate) return false;

            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 7);

            if (taskDueDate < startOfWeek || taskDueDate >= endOfWeek)
              return false;
          } else if (dueDateFilter === "This Month") {
            if (!taskDueDate) return false;

            const startOfMonth = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
            const endOfMonth = new Date(
              today.getFullYear(),
              today.getMonth() + 1,
              0
            );

            if (taskDueDate < startOfMonth || taskDueDate > endOfMonth)
              return false;
          } else if (dueDateFilter === "Overdue") {
            if (!taskDueDate || taskDueDate >= today) return false;
          } else if (dueDateFilter === "No Due Date") {
            if (taskDueDate !== null) return false;
          }
        }

        return true;
      }),
    })
  );

  // Sort tasks
  const sortedProjectsWithTasks = filteredProjectsWithTasks.map(
    (projectWithTasks) => ({
      ...projectWithTasks,
      tasks: [...projectWithTasks.tasks].sort((a, b) => {
        const aValue = a[sortBy as keyof Task];
        const bValue = b[sortBy as keyof Task];

        // Handle null values
        if (aValue === null) return sortOrder === "asc" ? -1 : 1;
        if (bValue === null) return sortOrder === "asc" ? 1 : -1;

        // Handle date comparisons
        if (
          typeof aValue === "string" &&
          (sortBy === "dueDate" ||
            sortBy === "createdAt" ||
            sortBy === "updatedAt")
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
      }),
    })
  );

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Tasks</h1>
      </div>

      <EnhancedFilters
        projectId="my-tasks"
        collaborators={[]}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      ) : sortedProjectsWithTasks.length === 0 ||
        sortedProjectsWithTasks.every((p) => p.tasks.length === 0) ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No tasks found</h2>
          <p className="mb-6 text-muted-foreground">
            {statusFilter
              ? "No tasks match the selected status filter."
              : "You don't have any tasks assigned to you yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedProjectsWithTasks.map(
            (projectWithTasks) =>
              projectWithTasks.tasks.length > 0 && (
                <div key={projectWithTasks.project.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      <Link
                        href={`/projects/${projectWithTasks.project.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {projectWithTasks.project.name}
                      </Link>
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {projectWithTasks.tasks.length} task
                      {projectWithTasks.tasks.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {projectWithTasks.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex flex-col rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50 sm:p-6"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="text-lg font-semibold">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  priorityColors[
                                    task.priority as keyof typeof priorityColors
                                  ] || "bg-gray-500"
                                }`}
                              />
                              <span className="text-xs font-medium">
                                {task.priority}
                              </span>
                            </div>
                            <TaskOptions
                              task={{
                                ...task,
                                projectId: projectWithTasks.project.id,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${
                                statusColors[
                                  task.status as keyof typeof statusColors
                                ] || "bg-gray-500"
                              }`}
                            />
                            <span className="text-sm">{task.status}</span>
                          </div>

                          {task.dueDate && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Due:{" "}
                              </span>
                              {new Date(task.dueDate).toLocaleDateString()}
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
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
