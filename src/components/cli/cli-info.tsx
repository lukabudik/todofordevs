"use client";

import { Code, Terminal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CliInfo() {
  return (
    <section className="py-16 bg-muted/10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary">
                Command Line Power
              </span>
            </div>
            <h2 className="text-3xl font-bold font-mono mb-4">
              Introducing the{" "}
              <span className="text-primary">TodoForDevs CLI</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Manage your tasks without leaving your terminal. Our new CLI tool
              lets you create, view, and update tasks directly from your command
              line - perfect for developers who live in the terminal.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="default" className="font-mono">
                <Link href="https://todofordevs.com/cli" target="_blank">
                  Learn More
                </Link>
              </Button>
              <Button asChild variant="outline" className="font-mono">
                <Link
                  href="https://github.com/lukabudik/todofordevs-cli"
                  target="_blank"
                >
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 bg-card rounded-lg border shadow-sm p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-primary" />
              <span className="font-semibold">CLI Examples</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1">Install the CLI:</p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>pnpm install -g todofordevs</code>
                </pre>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">List your tasks:</p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>todo task list</code>
                </pre>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Add a new task:</p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>todo task add</code>
                </pre>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  View project details:
                </p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>todo project current</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
