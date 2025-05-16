"use client";

import { Code, Download, Terminal } from "lucide-react";
import Link from "next/link";

import { LandingLayout } from "@/components/layout/landing-layout";
import { Button } from "@/components/ui/button";

export default function CliPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Code pattern background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background -z-10">
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-3 gap-1 h-full w-full">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="text-xs font-mono opacity-20 p-2">
                  {`$ todo task add --priority high`}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary">
                Command Line Interface
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-mono mb-4">
              TodoForDevs <span className="text-primary">CLI</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Manage your tasks and projects directly from your terminal.
              Perfect for developers who live in the command line.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="default"
                className="px-6 py-2 text-sm font-mono"
              >
                <Link href="https://www.npmjs.com/package/todofordevs?activeTab=readme">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Install CLI</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="px-6 py-2 text-sm font-mono"
              >
                <Link href="/register">
                  <span>Create Account</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-mono mb-4">Installation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with the TodoForDevs CLI in just a few steps.
            </p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6 font-mono text-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-primary" />
              <span className="font-semibold">Installation</span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-2">
                  Using pnpm (recommended):
                </p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>pnpm install -g todofordevs</code>
                </pre>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Using npm:</p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>npm install -g todofordevs</code>
                </pre>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Using yarn:</p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>yarn global add todofordevs</code>
                </pre>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">
                  Verify installation:
                </p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>todo --help</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commands Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-mono mb-4">Commands</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the powerful commands available in the TodoForDevs CLI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Authentication Commands */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                Authentication
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-mono font-medium">todo auth login</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Log in to your TodoForDevs account
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">todo auth logout</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Log out from your current session
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">todo auth status</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check your current authentication status
                  </p>
                </div>
              </div>
            </div>

            {/* Project Commands */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                Project Management
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-mono font-medium">todo project list</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    List all your projects
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">todo project select</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select an active project
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">todo project current</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Show the currently selected project
                  </p>
                </div>
              </div>
            </div>

            {/* Task Commands */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                Task Management
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-mono font-medium">todo task list</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    List tasks for the active project
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">todo task add</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add a new task to the active project
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">
                    todo task view &lt;taskId&gt;
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    View detailed information about a specific task
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">
                    todo task update &lt;taskId&gt;
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Update an existing task
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">
                    todo task delete &lt;taskId&gt;
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Delete a task
                  </p>
                </div>
              </div>
            </div>

            {/* Global Options */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                Global Options
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-mono font-medium">todo --help</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Display help for the command
                  </p>
                </div>
                <div>
                  <p className="font-mono font-medium">
                    todo &lt;command&gt; --help
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Display help for a specific command
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold font-mono mb-6">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Install the TodoForDevs CLI today and manage your tasks directly
            from your terminal.
          </p>
          <Button
            asChild
            size="default"
            className="px-6 py-2 text-sm font-mono"
          >
            <Link href="https://www.npmjs.com/package/todofordevs?activeTab=readme">
              <Download className="mr-2 h-4 w-4" />
              <span>Install CLI</span>
            </Link>
          </Button>
        </div>
      </section>
    </LandingLayout>
  );
}
