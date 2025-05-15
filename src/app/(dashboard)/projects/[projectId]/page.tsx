"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ProjectOptions } from "@/components/projects/project-options";
import { ProjectCollaborators } from "@/components/projects/project-collaborators";
import { TaskFormDialog } from "@/components/tasks/dialogs";
// Removed unused imports
import { useSession } from "next-auth/react";
import { ViewSwitcher } from "@/components/kanban/view-switcher";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { EnhancedTaskList } from "@/components/tasks/list";
import { EnhancedFilters } from "@/components/tasks/filters";

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
    name: string | null;
    email: string | null;
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

  // View state (list or board)
  const [currentView, setCurrentView] = useState<"list" | "board">("list");

  // Function to handle task updates (for drag-and-drop status changes)
  const handleTaskUpdate = async (taskId: string, data: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Update the task in the local state
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map((task) =>
            task.id === taskId ? { ...task, ...data } : task
          ),
        };
      });
    } catch {
      // Silently handle error - could add error state if needed
    }
  };

  // Task filtering and sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null);
  const [showNoAssignee, setShowNoAssignee] = useState(false);
  const [showNoDueDate, setShowNoDueDate] = useState(false);
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
      } catch {
        setError("Error loading project. Please try again later.");
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
      } catch {
        // Silently handle error - could add error state if needed
      }
    };

    fetchCollaborators();
  }, [projectId]);

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
      setAssigneeFilter(filters.assigneeFilter);
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

  // Filter and sort tasks
  const filteredTasks =
    project?.tasks.filter((task) => {
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

      // Assignee filter
      if (showNoAssignee && task.assigneeId !== null) return false;
      if (assigneeFilter && task.assigneeId !== assigneeFilter) return false;

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

  // Removed unused color mappings

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
          <ViewSwitcher
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <ProjectCollaborators projectId={projectId} isOwner={isOwner} />
          <TaskFormDialog projectId={projectId} mode="create" />
          <ProjectOptions project={project} />
        </div>
      </div>

      {/* Only show filters in list view */}
      {currentView === "list" && (
        <EnhancedFilters
          projectId={projectId}
          collaborators={collaborators}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />
      )}

      {/* Conditional rendering based on view */}
      {currentView === "board" ? (
        <div className="h-[calc(100vh-240px)]">
          <KanbanBoard
            tasks={project.tasks.map((task) => ({
              ...task,
              projectId,
            }))}
            projectId={projectId}
            onTaskUpdate={handleTaskUpdate}
            onViewChange={setCurrentView}
            currentView={currentView}
          />
        </div>
      ) : filteredTasks.length === 0 ? (
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
        <EnhancedTaskList
          tasks={sortedTasks.map((task) => {
            // Ensure assignee information is properly included
            let assignee = task.assignee;

            // If task has assigneeId but no assignee object, try to find the collaborator
            if (!assignee && task.assigneeId) {
              const collaborator = collaborators.find(
                (c) => c.id === task.assigneeId
              );
              if (collaborator) {
                // Create a properly structured assignee object
                // Try to get the user's image from the session if it's the current user
                const isCurrentUser = session?.user?.id === collaborator.id;
                // Ensure image is either string or null (not undefined)
                const userImage =
                  isCurrentUser && session?.user?.image
                    ? session.user.image
                    : null;

                assignee = {
                  id: collaborator.id,
                  name: collaborator.name,
                  email: collaborator.email,
                  image: userImage, // Use the user's image if available
                };
              }
            }

            return {
              ...task,
              projectId,
              assignee,
            };
          })}
          projectId={projectId}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}
