import { ReactNode } from "react";

import { Breadcrumbs } from "./breadcrumbs";
import { Navbar } from "./navbar";

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
