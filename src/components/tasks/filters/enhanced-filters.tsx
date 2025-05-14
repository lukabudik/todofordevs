"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Save,
  Filter,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterPreset {
  id: string;
  name: string;
  filters: {
    searchQuery: string;
    statusFilter: string | null;
    priorityFilter: string | null;
    assigneeFilter: string | null;
    dueDateFilter: string | null;
    showNoAssignee: boolean;
    showNoDueDate: boolean;
  };
  sortBy: string;
  sortOrder: string;
}

interface EnhancedFiltersProps {
  projectId: string;
  collaborators: Array<{
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  }>;
  onFiltersChange: (filters: {
    searchQuery: string;
    statusFilter: string | null;
    priorityFilter: string | null;
    assigneeFilter: string | null;
    dueDateFilter: string | null;
    showNoAssignee: boolean;
    showNoDueDate: boolean;
  }) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export function EnhancedFilters({
  projectId,
  collaborators,
  onFiltersChange,
  onSortChange,
}: EnhancedFiltersProps) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null);
  const [showNoAssignee, setShowNoAssignee] = useState(false);
  const [showNoDueDate, setShowNoDueDate] = useState(false);

  // Sort state
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter presets
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [savePresetDialogOpen, setSavePresetDialogOpen] = useState(false);

  // Active filters count for badge
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Advanced filters popover state
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Status and priority options
  const statusOptions = ["To Do", "In Progress", "Blocked", "Done"];
  const priorityOptions = ["Low", "Medium", "High", "Urgent"];
  const dueDateOptions = [
    "Today",
    "This Week",
    "This Month",
    "Overdue",
    "No Due Date",
  ];

  // Load saved presets and filters from localStorage on component mount
  useEffect(() => {
    // Load presets
    const savedPresets = localStorage.getItem(
      `todofordevs-presets-${projectId}`
    );
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }

    // Load last used filters
    const savedFilters = localStorage.getItem(
      `todofordevs-filters-${projectId}`
    );
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setSearchQuery(filters.searchQuery || "");
      setStatusFilter(filters.statusFilter);
      setPriorityFilter(filters.priorityFilter);
      setAssigneeFilter(filters.assigneeFilter);
      setDueDateFilter(filters.dueDateFilter);
      setShowNoAssignee(filters.showNoAssignee || false);
      setShowNoDueDate(filters.showNoDueDate || false);
      setSortBy(filters.sortBy || "updatedAt");
      setSortOrder(filters.sortOrder || "desc");
    }
  }, [projectId]);

  // Update active filters count
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (statusFilter) count++;
    if (priorityFilter) count++;
    if (assigneeFilter) count++;
    if (dueDateFilter) count++;
    if (showNoAssignee) count++;
    if (showNoDueDate) count++;
    setActiveFiltersCount(count);

    // Save current filters to localStorage
    const currentFilters = {
      searchQuery,
      statusFilter,
      priorityFilter,
      assigneeFilter,
      dueDateFilter,
      showNoAssignee,
      showNoDueDate,
      sortBy,
      sortOrder,
    };
    localStorage.setItem(
      `todofordevs-filters-${projectId}`,
      JSON.stringify(currentFilters)
    );

    // Notify parent component of filter changes
    onFiltersChange({
      searchQuery,
      statusFilter,
      priorityFilter,
      assigneeFilter,
      dueDateFilter,
      showNoAssignee,
      showNoDueDate,
    });
  }, [
    searchQuery,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    dueDateFilter,
    showNoAssignee,
    showNoDueDate,
    projectId,
    onFiltersChange,
  ]);

  // Update sort when changed
  useEffect(() => {
    onSortChange(sortBy, sortOrder);
  }, [sortBy, sortOrder, onSortChange]);

  // Save current filters as a preset
  const savePreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: newPresetName,
      filters: {
        searchQuery,
        statusFilter,
        priorityFilter,
        assigneeFilter,
        dueDateFilter,
        showNoAssignee,
        showNoDueDate,
      },
      sortBy,
      sortOrder,
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem(
      `todofordevs-presets-${projectId}`,
      JSON.stringify(updatedPresets)
    );
    setNewPresetName("");
    setSavePresetDialogOpen(false);
  };

  // Apply a preset
  const applyPreset = (preset: FilterPreset) => {
    setSearchQuery(preset.filters.searchQuery || "");
    setStatusFilter(preset.filters.statusFilter);
    setPriorityFilter(preset.filters.priorityFilter);
    setAssigneeFilter(preset.filters.assigneeFilter);
    setDueDateFilter(preset.filters.dueDateFilter);
    setShowNoAssignee(preset.filters.showNoAssignee || false);
    setShowNoDueDate(preset.filters.showNoDueDate || false);
    setSortBy(preset.sortBy);
    setSortOrder(preset.sortOrder);
  };

  // Delete a preset
  const deletePreset = (id: string) => {
    const updatedPresets = presets.filter((preset) => preset.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem(
      `todofordevs-presets-${projectId}`,
      JSON.stringify(updatedPresets)
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setPriorityFilter(null);
    setAssigneeFilter(null);
    setDueDateFilter(null);
    setShowNoAssignee(false);
    setShowNoDueDate(false);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Get due date filter label
  const getDueDateLabel = (filter: string | null) => {
    if (!filter) return "Any Due Date";
    return filter;
  };

  return (
    <div className="mb-6 space-y-4 rounded-md border bg-card p-4 shadow-sm">
      {/* Search and quick filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              {statusFilter || "Status"}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setStatusFilter(null)}>
              All Statuses{" "}
              {!statusFilter && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {statusOptions.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
              >
                {status}{" "}
                {statusFilter === status && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              {priorityFilter || "Priority"}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
              All Priorities{" "}
              {!priorityFilter && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {priorityOptions.map((priority) => (
              <DropdownMenuItem
                key={priority}
                onClick={() => setPriorityFilter(priority)}
              >
                {priority}{" "}
                {priorityFilter === priority && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Advanced filters button */}
        <Popover
          open={advancedFiltersOpen}
          onOpenChange={setAdvancedFiltersOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              Advanced
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filters</h4>

              {/* Assignee filter */}
              <div className="space-y-2">
                <Label htmlFor="assignee-filter">Assignee</Label>
                <select
                  id="assignee-filter"
                  value={assigneeFilter || ""}
                  onChange={(e) => setAssigneeFilter(e.target.value || null)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">All Assignees</option>
                  {collaborators.map((collaborator) => (
                    <option key={collaborator.id} value={collaborator.id}>
                      {collaborator.name || collaborator.email || "Unknown"}
                    </option>
                  ))}
                </select>
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="show-unassigned"
                    checked={showNoAssignee}
                    onCheckedChange={(checked) => setShowNoAssignee(!!checked)}
                  />
                  <label
                    htmlFor="show-unassigned"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Only show unassigned tasks
                  </label>
                </div>
              </div>

              {/* Due date filter */}
              <div className="space-y-2">
                <Label htmlFor="due-date-filter">Due Date</Label>
                <select
                  id="due-date-filter"
                  value={dueDateFilter || ""}
                  onChange={(e) => setDueDateFilter(e.target.value || null)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Any Due Date</option>
                  {dueDateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="show-no-due-date"
                    checked={showNoDueDate}
                    onCheckedChange={(checked) => setShowNoDueDate(!!checked)}
                  />
                  <label
                    htmlFor="show-no-due-date"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Only show tasks without due date
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset All
                </Button>
                <Button size="sm" onClick={() => setAdvancedFiltersOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort controls */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                Sort:{" "}
                {sortBy === "updatedAt"
                  ? "Updated"
                  : sortBy === "createdAt"
                  ? "Created"
                  : sortBy === "dueDate"
                  ? "Due Date"
                  : sortBy === "priority"
                  ? "Priority"
                  : sortBy === "status"
                  ? "Status"
                  : sortBy === "title"
                  ? "Title"
                  : sortBy}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setSortBy("updatedAt")}>
                Updated{" "}
                {sortBy === "updatedAt" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                Created{" "}
                {sortBy === "createdAt" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
                Due Date{" "}
                {sortBy === "dueDate" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("priority")}>
                Priority{" "}
                {sortBy === "priority" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("status")}>
                Status{" "}
                {sortBy === "status" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>
                Title{" "}
                {sortBy === "title" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Presets dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              Presets <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Saved Filter Presets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {presets.length === 0 ? (
              <DropdownMenuItem disabled>No saved presets</DropdownMenuItem>
            ) : (
              presets.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="flex justify-between"
                >
                  {preset.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <Dialog
              open={savePresetDialogOpen}
              onOpenChange={setSavePresetDialogOpen}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Current Filters
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Filter Preset</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="preset-name">Preset Name</Label>
                  <Input
                    id="preset-name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="My Filter Preset"
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSavePresetDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={savePreset}>Save Preset</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search:{" "}
              {searchQuery.length > 20
                ? `${searchQuery.substring(0, 20)}...`
                : searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {statusFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter}
              <button
                onClick={() => setStatusFilter(null)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {priorityFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Priority: {priorityFilter}
              <button
                onClick={() => setPriorityFilter(null)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {assigneeFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Assignee:{" "}
              {collaborators.find((c) => c.id === assigneeFilter)?.name ||
                collaborators.find((c) => c.id === assigneeFilter)?.email ||
                "Unknown"}
              <button
                onClick={() => setAssigneeFilter(null)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {showNoAssignee && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Unassigned Only
              <button
                onClick={() => setShowNoAssignee(false)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {dueDateFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Due: {getDueDateLabel(dueDateFilter)}
              <button
                onClick={() => setDueDateFilter(null)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {showNoDueDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              No Due Date Only
              <button
                onClick={() => setShowNoDueDate(false)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 text-xs"
            onClick={resetFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
