"use client";

import { Terminal } from "lucide-react";
import Link from "next/link";

import { CommandItem } from "@/components/ui/command";

interface CliCommandItemProps {
  onSelect: () => void;
}

export function CliCommandItem({ onSelect }: CliCommandItemProps) {
  return (
    <CommandItem onSelect={onSelect} className="flex items-center gap-2">
      <Terminal className="mr-2 h-4 w-4" />
      <span>TodoForDevs CLI</span>
      <span className="ml-auto text-xs text-muted-foreground">
        Command Line Tool
      </span>
    </CommandItem>
  );
}
