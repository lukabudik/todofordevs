"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EnhancedMarkdownEditor } from "@/components/markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Collaborator {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

export interface TaskFormValues {
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assigneeId: string | null;
}

interface TaskFormProps {
  initialValues?: TaskFormValues;
  projectId: string;
  collaborators?: Collaborator[];
  isLoading?: boolean;
  error?: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  mode?: "create" | "edit";
  isSimplified?: boolean;
}

export function TaskForm({
  initialValues,
  projectId,
  collaborators = [],
  isLoading = false,
  error = "",
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = "Cancel",
  mode = "create",
  isSimplified = false,
}: TaskFormProps) {
  // Form state
  const [values, setValues] = useState<TaskFormValues>({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    status: initialValues?.status || "To Do",
    priority: initialValues?.priority || "Medium",
    dueDate: initialValues?.dueDate ? initialValues.dueDate.split("T")[0] : "",
    assigneeId: initialValues?.assigneeId || "unassigned",
  });

  // State for expanded/collapsed advanced options
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(!isSimplified);

  // Update form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title || "",
        description: initialValues.description || "",
        status: initialValues.status || "To Do",
        priority: initialValues.priority || "Medium",
        dueDate: initialValues.dueDate
          ? initialValues.dueDate.split("T")[0]
          : "",
        assigneeId: initialValues.assigneeId || "unassigned",
      });
    }
  }, [initialValues]);

  // Status options
  const statusOptions = ["To Do", "In Progress", "Blocked", "Done"];

  // Priority options
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];

  // Handle input change
  const handleChange = (field: keyof TaskFormValues, value: string | null) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!values.title.trim()) {
      return; // Don't submit if title is empty
    }

    // Format values for submission
    const formattedValues: TaskFormValues = {
      ...values,
      title: values.title.trim(),
      description: values.description?.trim() || null,
      dueDate: values.dueDate || null,
      assigneeId: values.assigneeId === "unassigned" ? null : values.assigneeId,
    };

    await onSubmit(formattedValues);
  };

  // Toggle advanced options
  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title field - always visible */}
      <div className="grid gap-2">
        <Label htmlFor="title" className="text-left">
          Title
        </Label>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Task title"
          className="col-span-3"
          autoFocus
          required
        />
      </div>

      {/* Description field - always visible */}
      <div className="grid gap-2">
        <Label htmlFor="description" className="text-left">
          Description
        </Label>
        <EnhancedMarkdownEditor
          value={values.description || ""}
          onChange={(value) => handleChange("description", value)}
          placeholder="Task description (supports Markdown)"
          minHeight={showAdvancedOptions ? "200px" : "100px"}
        />
      </div>

      {/* Toggle for advanced options */}
      {isSimplified && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleAdvancedOptions}
          className="w-full flex items-center justify-center gap-1 text-muted-foreground"
        >
          {showAdvancedOptions ? (
            <>
              <ChevronUp className="h-4 w-4" />
              <span>Hide advanced options</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>Show advanced options</span>
            </>
          )}
        </Button>
      )}

      {/* Advanced options - conditionally visible */}
      {showAdvancedOptions && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-left">
                Status
              </Label>
              <Select
                value={values.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority" className="text-left">
                Priority
              </Label>
              <Select
                value={values.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate" className="text-left">
              Due Date (Optional)
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={values.dueDate || ""}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignee" className="text-left">
              Assignee (Optional)
            </Label>
            <Select
              value={values.assigneeId || "unassigned"}
              onValueChange={(value) => handleChange("assigneeId", value)}
            >
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {collaborators.length === 0 ? (
                  <SelectItem value="loading" disabled>
                    No collaborators available
                  </SelectItem>
                ) : (
                  collaborators.map((collaborator) => (
                    <SelectItem key={collaborator.id} value={collaborator.id}>
                      {collaborator.name || collaborator.email || "Unknown"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Form actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : submitLabel ||
              (mode === "create" ? "Create Task" : "Save Changes")}
        </Button>
      </div>
    </form>
  );
}
