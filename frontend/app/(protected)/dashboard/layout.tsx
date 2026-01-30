import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";

// Menu items.

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
        <SidebarTrigger />
      <main className="flex items-center content-center p-4">
        {children}
      </main>
    </SidebarProvider>
  );
}
