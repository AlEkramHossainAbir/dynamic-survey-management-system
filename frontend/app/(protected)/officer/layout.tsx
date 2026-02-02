"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasRole } from "@/lib/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/officer-app-sidebar";

export default function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Auth is already checked by parent (protected) layout
    // Only need to verify officer role here
    if (!hasRole("officer")) {
      router.replace("/admin/surveys");
    }
  }, [router]);

  // Show nothing while checking role (prevents flash of wrong content)
  if (!hasRole("officer")) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="w-full p-4 w-full">{children}</main>
    </SidebarProvider>
  );
}
