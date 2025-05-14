"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Plus, CheckSquare } from "lucide-react";
import { ProjectSwitcher } from "@/components/projects/project-switcher";
import { Button } from "@/components/ui/button";
import { QuickAddDialog } from "@/components/tasks/dialogs";
import { CommandPalette } from "@/components/command/command-palette";

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Handle keyboard shortcut (Shift+N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Shift+N is pressed
      if (e.shiftKey && e.key === "N") {
        // Prevent the default browser behavior
        e.preventDefault();

        // Only open the dialog if the user is authenticated
        if (isAuthenticated) {
          setIsQuickAddOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthenticated]);

  // Generate initials for avatar if no image is available
  const getInitials = () => {
    if (!session?.user?.name) return "?";
    return session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <CommandPalette />
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">TodoForDevs</span>
            </Link>
            {isAuthenticated && (
              <>
                <ProjectSwitcher />
                <Link
                  href="/my-tasks"
                  className="flex items-center gap-1 text-sm font-medium hover:text-primary"
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>My Tasks</span>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1"
                  title="Quick Add Task (Shift+N)"
                  onClick={() => setIsQuickAddOpen(true)}
                  data-quick-add-trigger="true"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">New Task</span>
                </Button>

                <QuickAddDialog
                  isOpen={isQuickAddOpen}
                  onOpenChange={setIsQuickAddOpen}
                />
              </>
            )}
            <ThemeToggle />
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        getInitials()
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {session.user.name || "User"}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                      data-logout-trigger="true"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium hover:underline"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
