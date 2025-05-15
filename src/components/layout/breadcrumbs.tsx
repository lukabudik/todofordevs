"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useState } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const pathSegments = pathname.split("/").filter(Boolean);
      const items: BreadcrumbItem[] = [];

      // Always add home
      items.push({ label: "Home", href: "/" });

      if (pathSegments.length === 0) {
        // We're on the home page, no need for additional breadcrumbs
        setBreadcrumbs(items);
        return;
      }

      // Handle first-level routes
      if (pathSegments[0] === "projects") {
        items.push({ label: "Projects", href: "/projects" });

        // If we're on a specific project page
        if (pathSegments.length > 1) {
          const projectId = pathSegments[1];
          setIsLoading(true);

          try {
            // Fetch project details to get the name
            const response = await fetch(`/api/projects/${projectId}`);
            if (response.ok) {
              const data = await response.json();
              items.push({
                label: data.project.name,
                href: `/projects/${projectId}`,
              });
            }
          } catch {
            // Silently handle error - could add error state if needed
          } finally {
            setIsLoading(false);
          }
        }
      } else if (pathSegments[0] === "profile") {
        items.push({ label: "Profile", href: "/profile" });
      }

      setBreadcrumbs(items);
    };

    generateBreadcrumbs();
  }, [pathname]);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on the home page
  }

  return (
    <nav className="flex items-center space-x-1 border-b px-6 py-2 text-sm">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
          )}
          {index === 0 ? (
            <Link
              href={breadcrumb.href}
              className="flex items-center hover:text-primary"
            >
              <Home className="mr-1 h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          ) : index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">
              {isLoading ? "Loading..." : breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="hover:text-primary hover:underline"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
