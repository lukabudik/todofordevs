import { MainLayout } from "@/components/layout/main-layout";
import Link from "next/link";

export default function Home() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-8 py-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to TodoForDevs</h1>
          <p className="text-xl text-muted-foreground">
            A simple, fast, and developer-focused todo app
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">Key Features</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Markdown support with
                syntax highlighting
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Keyboard-driven workflow
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Fast and uncluttered UI
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Team collaboration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Light and dark mode
              </li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">Get Started</h2>
            <p className="mb-4 text-muted-foreground">
              Create an account to start managing your tasks and projects.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
