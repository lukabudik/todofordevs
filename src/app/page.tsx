"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Code,
  Users,
  Keyboard,
  Moon,
  Github,
  Zap,
  Braces,
  Terminal,
  Star,
  GitFork,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  // Redirect authenticated users to their first project
  useEffect(() => {
    if (isAuthenticated) {
      const redirectToFirstProject = async () => {
        try {
          const response = await fetch("/api/projects");
          if (response.ok) {
            const data = await response.json();
            if (data.projects && data.projects.length > 0) {
              // Redirect to the first project
              router.push(`/projects/${data.projects[0].id}`);
            } else {
              // No projects, redirect to projects page to create one
              router.push("/projects");
            }
          }
        } catch (error) {
          // If there's an error, fallback to projects page
          router.push("/projects");
        }
      };

      redirectToFirstProject();
    }
  }, [isAuthenticated, router]);

  // If still loading or authenticated, show a minimal loading state
  if (status === "loading" || isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading your workspace...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Marketing page for non-authenticated users
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Code pattern background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background -z-10">
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-3 gap-1 h-full w-full">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="text-xs font-mono opacity-20 p-2">
                  {`const task${i} = { id: ${i}, status: 'done' };`}
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
                No Nonsense Todo for Developers
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-mono mb-4">
              The Task Manager That{" "}
              <span className="text-primary">Works Like Your IDE</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Simple. Fast. Distraction-free. Built for developers who just want
              to get things done.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="default"
                className="px-6 py-2 text-sm font-mono"
              >
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="px-6 py-2 text-sm font-mono group"
              >
                <Link
                  href="https://github.com/lukabudik/todofordevs"
                  className="flex items-center gap-2"
                >
                  <Github className="h-5 w-5" />
                  <span>View on GitHub</span>
                  <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Concept Section */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-mono mb-4">
              Task Management, Simplified
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We stripped away the complexity and focused on what developers
              actually need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Braces className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-mono font-semibold mb-3">
                Built for Code
              </h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                <span className="text-primary font-bold">&gt;</span> Markdown
                with syntax highlighting
                <br />
                <span className="text-primary font-bold">&gt;</span> Code
                snippets in tasks
                <br />
                <span className="text-primary font-bold">&gt;</span> GitHub
                integration
                <br />
                <span className="text-primary font-bold">&gt;</span>{" "}
                IDE-inspired interface
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-mono font-semibold mb-3">
                Distraction Free
              </h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                <span className="text-primary font-bold">&gt;</span> Minimalist
                design
                <br />
                <span className="text-primary font-bold">&gt;</span> Keyboard
                shortcuts
                <br />
                <span className="text-primary font-bold">&gt;</span> Focus mode
                <br />
                <span className="text-primary font-bold">&gt;</span> No
                unnecessary features
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-mono font-semibold mb-3">
                Team Ready
              </h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                <span className="text-primary font-bold">&gt;</span> Real-time
                collaboration
                <br />
                <span className="text-primary font-bold">&gt;</span> Task
                assignments
                <br />
                <span className="text-primary font-bold">&gt;</span> Project
                sharing
                <br />
                <span className="text-primary font-bold">&gt;</span> Team
                permissions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Banner */}
      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold font-mono mb-4">
                100% <span className="text-primary">Open Source</span> & Free to
                Use
              </h2>
              <p className="text-muted-foreground mb-6">
                TodoForDevs is completely free on our hosted version. Self-host
                it, modify it, make it yours. We believe in open source software
                and the power of community-driven development.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-mono">0 stars :(</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-5 w-5 text-primary" />
                  <span className="font-mono">0 forks :(</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="font-mono">
                    1 contributor and many LLMs :)
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Button
                asChild
                variant="outline"
                size="default"
                className="px-6 py-2 text-sm font-mono group"
              >
                <Link
                  href="https://github.com/lukabudik/todofordevs"
                  className="flex items-center gap-2"
                >
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Star on GitHub</span>
                  <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-mono mb-4">
              Designed for Developer Workflow
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A task manager that fits seamlessly into your development process.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg border shadow-sm relative">
              <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold">
                1
              </div>
              <h3 className="font-mono font-semibold mb-2 mt-2">
                Create a project
              </h3>
              <p className="text-sm text-muted-foreground">
                Set up a new project for your team or personal use.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm relative">
              <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold">
                2
              </div>
              <h3 className="font-mono font-semibold mb-2 mt-2">
                Add tasks with code
              </h3>
              <p className="text-sm text-muted-foreground">
                Include code snippets and technical details in your tasks.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm relative">
              <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold">
                3
              </div>
              <h3 className="font-mono font-semibold mb-2 mt-2">Collaborate</h3>
              <p className="text-sm text-muted-foreground">
                Invite team members and assign tasks to collaborate effectively.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm relative">
              <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold">
                4
              </div>
              <h3 className="font-mono font-semibold mb-2 mt-2">
                Track progress
              </h3>
              <p className="text-sm text-muted-foreground">
                Use the kanban board to visualize and manage your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold font-mono mb-6">
            Ready to streamline your development workflow?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join developers who use TodoForDevs to manage their projects more
            efficiently.
          </p>
          <Button
            asChild
            size="default"
            className="px-6 py-2 text-sm font-mono"
          >
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                  <Braces className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold">TodoForDevs</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A task manager built specifically for developers and development
                teams.
              </p>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} TodoForDevs. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="font-mono font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/register"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/lukabudik/todofordevs"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono font-semibold mb-4">Open Source</h3>
              <p className="text-sm text-muted-foreground mb-4">
                TodoForDevs is open source software licensed under the MIT
                License.
              </p>
              <Link
                href="https://github.com/lukabudik/todofordevs"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>View on GitHub</span>
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
            <p>Made with 💻 by developers, for developers.</p>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
