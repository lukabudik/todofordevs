import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Breadcrumbs } from "./breadcrumbs";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
