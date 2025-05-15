import type { Metadata } from "next";

import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = {
  title: "Dashboard - TodoForDevs",
  description: "Manage your projects and tasks",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
