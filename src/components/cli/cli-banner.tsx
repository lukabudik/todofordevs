"use client";

import { Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CliBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Terminal className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold">
              New: TodoForDevs CLI is now available!
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your tasks directly from your terminal. Install it with{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                pnpm install -g todofordevs
              </code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDismissed(true)}
                >
                  Dismiss
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hide this message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button asChild variant="default" size="sm" className="font-mono">
            <Link href="https://todofordevs.com/cli" target="_blank">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
