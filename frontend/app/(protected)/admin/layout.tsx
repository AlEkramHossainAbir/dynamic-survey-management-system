"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasRole } from "@/lib/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin-app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Auth is already checked by parent (protected) layout
    // Only need to verify admin role here
    if (!hasRole("admin")) {
      router.replace("/officer/surveys");
    }
  }, [router]);

  // Show nothing while checking role (prevents flash of wrong content)
  if (!hasRole("admin")) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="flex items-center content-center p-4 w-full">{children}</main>
    </SidebarProvider>
  );
}
