"use client";

import { useState } from "react";
import { TaskActions } from "@/components/tasks/TaskActions";
import { Button } from "@/components/ui/button";
import {
  Settings,
  CircleDashed,
  CircleEllipsis,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react";
import { TaskDetailPanel } from "@/components/tasks/dialogs/TaskDetailPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

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
  assignee?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
}

interface TaskListProps {
  tasks: Task[];
  projectId: string;
  onTaskUpdate: (taskId: string, data: Partial<Task>) => Promise<void>;
}

export function TaskList({ tasks, projectId, onTaskUpdate }: TaskListProps) {
  // State for visible columns
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    status: true,
    priority: true,
    dueDate: true,
    assignee: true,
    updatedAt: true,
  });

  // State for task detail panel
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);

  // Priority colors
  const priorityColors = {
    Low: "bg-blue-500 text-blue-500",
    Medium: "bg-yellow-500 text-yellow-500",
    High: "bg-orange-500 text-orange-500",
    Urgent: "bg-red-500 text-red-500",
  };

  // Status colors and styles (only for the dot and border)
  const statusColors = {
    "To Do": "border-gray-500",
    "In Progress": "border-blue-500",
    Blocked: "border-red-500",
    Done: "border-green-500",
  };

  // Status dot colors
  const statusDotColors = {
    "To Do": "bg-gray-500",
    "In Progress": "bg-blue-500",
    Blocked: "bg-red-500",
    Done: "bg-green-500",
  };

  // Status icons
  const statusIcons = {
    "To Do": <CircleDashed className="h-4 w-4 text-gray-500" />,
    "In Progress": <CircleEllipsis className="h-4 w-4 text-blue-500" />,
    Blocked: <AlertCircle className="h-4 w-4 text-red-500" />,
    Done: <CheckCircle className="h-4 w-4 text-green-500" />,
  };

  // Handle column visibility toggle
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  // Format time ago for display
  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Generate initials for assignee avatar if no image is available
  const getInitials = (assignee: Task["assignee"]) => {
    if (!assignee?.name) return "?";
    return assignee.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="overflow-hidden rounded-md border bg-card shadow-sm">
      {/* Table header with column customization */}
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Customize columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={visibleColumns.id}
              onCheckedChange={() => toggleColumn("id")}
            >
              ID
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.title}
              onCheckedChange={() => toggleColumn("title")}
              disabled
            >
              Title
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.status}
              onCheckedChange={() => toggleColumn("status")}
            >
              Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.priority}
              onCheckedChange={() => toggleColumn("priority")}
            >
              Priority
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.dueDate}
              onCheckedChange={() => toggleColumn("dueDate")}
            >
              Due Date
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.assignee}
              onCheckedChange={() => toggleColumn("assignee")}
            >
              Assignee
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.updatedAt}
              onCheckedChange={() => toggleColumn("updatedAt")}
            >
              Updated
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table header row */}
      <div className="grid grid-cols-12 gap-2 border-b bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground">
        {visibleColumns.id && <div className="col-span-1">ID</div>}
        <div className={`${visibleColumns.id ? "col-span-3" : "col-span-4"}`}>
          TITLE
        </div>
        {visibleColumns.status && <div className="col-span-1">STATUS</div>}
        {visibleColumns.priority && <div className="col-span-1">PRIORITY</div>}
        {visibleColumns.dueDate && <div className="col-span-1">DUE DATE</div>}
        {visibleColumns.assignee && <div className="col-span-2">ASSIGNEE</div>}
        {visibleColumns.updatedAt && <div className="col-span-2">UPDATED</div>}
        <div className="col-span-1 text-right">ACTIONS</div>
      </div>

      {/* Task rows */}
      <div className="divide-y">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-accent/50 cursor-pointer"
            onClick={() => setSelectedTaskId(task.id)}
          >
            {/* ID column */}
            {visibleColumns.id && (
              <div className="col-span-1 flex items-center">
                <span className="font-mono text-xs text-muted-foreground">
                  {task.id.substring(0, 8)}
                </span>
              </div>
            )}

            {/* Title column */}
            <div
              className={`${
                visibleColumns.id ? "col-span-3" : "col-span-4"
              } flex items-center`}
            >
              <span className="font-medium">{task.title}</span>
            </div>

            {/* Status column */}
            {visibleColumns.status && (
              <div className="col-span-1 flex items-center">
                <div
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-transparent ${
                    statusColors[task.status as keyof typeof statusColors] ||
                    "border-gray-500"
                  }`}
                >
                  <span className="text-foreground flex items-center gap-1">
                    {statusIcons[task.status as keyof typeof statusIcons] || (
                      <CircleDashed className="h-4 w-4 text-gray-500" />
                    )}
                    <span>{task.status}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Priority column */}
            {visibleColumns.priority && (
              <div className="col-span-1 flex items-center">
                <div className="flex items-center gap-1">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      priorityColors[
                        task.priority as keyof typeof priorityColors
                      ]?.split(" ")[0] || "bg-gray-500"
                    }`}
                  />
                  <span className="text-xs font-medium">{task.priority}</span>
                </div>
              </div>
            )}

            {/* Due Date column */}
            {visibleColumns.dueDate && (
              <div className="col-span-1 flex items-center">
                <span className="text-xs">{formatDate(task.dueDate)}</span>
              </div>
            )}

            {/* Assignee column */}
            {visibleColumns.assignee && (
              <div className="col-span-2 flex items-center">
                {task.assignee || task.assigneeId ? (
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {task.assignee?.image ? (
                        <img
                          src={task.assignee.image}
                          alt={task.assignee.name || "User"}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : task.assignee ? (
                        getInitials(task.assignee)
                      ) : (
                        <User className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <span className="text-xs">
                      {task.assignee?.name ||
                        task.assignee?.email ||
                        (task.assigneeId ? "Assigned" : "Unknown")}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Unassigned
                  </span>
                )}
              </div>
            )}

            {/* Updated column */}
            {visibleColumns.updatedAt && (
              <div className="col-span-2 flex items-center">
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(task.updatedAt)}
                </span>
              </div>
            )}

            {/* Actions column */}
            <div
              className="col-span-1 flex items-center justify-end gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <TaskActions
                task={{
                  ...task,
                  projectId,
                  assigneeId: task.assigneeId,
                }}
                onTaskUpdate={onTaskUpdate}
                onEditClick={(taskId) => {
                  setSelectedTaskId(taskId);
                  setOpenInEditMode(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        taskId={selectedTaskId}
        projectId={projectId}
        onClose={() => {
          setSelectedTaskId(null);
          setOpenInEditMode(false);
        }}
        onTaskUpdate={() => {
          // Refresh the task list
          window.location.reload();
        }}
        initialEditMode={openInEditMode}
      />
    </div>
  );
}
