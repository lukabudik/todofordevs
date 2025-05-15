"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Braces } from "lucide-react";
import { ProjectSwitcher } from "@/components/projects/project-switcher";
import { CommandPalette } from "@/components/command/command-palette";

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

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
        <div className="container flex h-16 items-center justify-between px-6 md:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Braces className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">
                  TodoForDevs
                </span>
                <span className="text-xs text-muted-foreground leading-none">
                  for developer teams
                </span>
              </div>
            </Link>
            {isAuthenticated && (
              <>
                <ProjectSwitcher />
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
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
