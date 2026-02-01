import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/officer-app-sidebar";

// Menu items.

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
        <SidebarTrigger />
      <main className="w-full p-4">
        {children}
      </main>
    </SidebarProvider>
  );
}
