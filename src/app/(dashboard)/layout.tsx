import { MainLayout } from "@/components/layout/main-layout";
import type { Metadata } from "next";

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
