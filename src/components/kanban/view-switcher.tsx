"use client";

import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ViewSwitcherProps {
  currentView: "list" | "board";
  onViewChange: (view: "list" | "board") => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewChange("list")}
        className={currentView === "list" ? "bg-accent" : ""}
        title="List View"
      >
        <List className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewChange("board")}
        className={currentView === "board" ? "bg-accent" : ""}
        title="Board View"
      >
        <LayoutGrid className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Board</span>
      </Button>
    </div>
  );
}
