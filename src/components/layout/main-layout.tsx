import { ReactNode } from "react";

import { Breadcrumbs } from "./breadcrumbs";
import { Navbar } from "./navbar";

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
