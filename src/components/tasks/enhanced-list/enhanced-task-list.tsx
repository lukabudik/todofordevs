"use client";

import { useState } from "react";
import { TaskOptions } from "@/components/tasks/task-options";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Edit, Check, X } from "lucide-react";
import { TaskDetailPanel } from "@/components/tasks/task-detail-panel";
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

interface EnhancedTaskListProps {
  tasks: Task[];
  projectId: string;
  onTaskUpdate: (taskId: string, data: Partial<Task>) => Promise<void>;
}

export function EnhancedTaskList({
  tasks,
  projectId,
  onTaskUpdate,
}: EnhancedTaskListProps) {
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

  // State for inline editing
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Task>>({});

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
    "To Do": "📋",
    "In Progress": "🔄",
    Blocked: "🚫",
    Done: "✅",
  };

  // Status options for inline editing
  const statusOptions = ["To Do", "In Progress", "Blocked", "Done"];

  // Priority options for inline editing
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];

  // Handle column visibility toggle
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Start editing a task
  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditValues({
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTask(null);
    setEditValues({});
  };

  // Save edited task
  const saveEditing = async (taskId: string) => {
    if (Object.keys(editValues).length > 0) {
      await onTaskUpdate(taskId, editValues);
    }
    setEditingTask(null);
    setEditValues({});
  };

  // Handle input change during editing
  const handleEditChange = (field: keyof Task, value: any) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
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

  // Truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
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
            onClick={() => {
              if (editingTask !== task.id) {
                setSelectedTaskId(task.id);
              }
            }}
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
              {editingTask === task.id ? (
                <input
                  type="text"
                  value={editValues.title || ""}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                  autoFocus
                />
              ) : (
                <span className="font-medium">{task.title}</span>
              )}
            </div>

            {/* Status column */}
            {visibleColumns.status && (
              <div className="col-span-1 flex items-center">
                {editingTask === task.id ? (
                  <select
                    value={editValues.status || task.status}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-transparent ${
                      statusColors[task.status as keyof typeof statusColors] ||
                      "border-gray-500"
                    }`}
                  >
                    <span
                      className={`mr-1 h-1.5 w-1.5 rounded-full ${
                        statusDotColors[
                          task.status as keyof typeof statusDotColors
                        ] || "bg-gray-500"
                      }`}
                    ></span>
                    <span className="text-foreground">
                      {statusIcons[task.status as keyof typeof statusIcons] ||
                        "📋"}{" "}
                      {task.status}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Priority column */}
            {visibleColumns.priority && (
              <div className="col-span-1 flex items-center">
                {editingTask === task.id ? (
                  <select
                    value={editValues.priority || task.priority}
                    onChange={(e) =>
                      handleEditChange("priority", e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                ) : (
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
                )}
              </div>
            )}

            {/* Due Date column */}
            {visibleColumns.dueDate && (
              <div className="col-span-1 flex items-center">
                {editingTask === task.id ? (
                  <input
                    type="date"
                    value={
                      editValues.dueDate
                        ? new Date(editValues.dueDate)
                            .toISOString()
                            .split("T")[0]
                        : task.dueDate
                        ? new Date(task.dueDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleEditChange("dueDate", e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  />
                ) : (
                  <span className="text-xs">{formatDate(task.dueDate)}</span>
                )}
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
                        "👤"
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
            <div className="col-span-1 flex items-center justify-end gap-1">
              {editingTask === task.id ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => saveEditing(task.id)}
                    title="Save changes"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={cancelEditing}
                    title="Cancel editing"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-80 hover:opacity-100"
                    onClick={() => startEditing(task)}
                    title="Quick edit task"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <TaskOptions
                    task={{
                      ...task,
                      projectId,
                      assigneeId: task.assigneeId,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        taskId={selectedTaskId}
        projectId={projectId}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdate={() => {
          // Refresh the task list
          window.location.reload();
        }}
      />
    </div>
  );
}
