"use client"

import {
  Calendar,
  Home,
  Inbox,
  LogOut,
  ChevronUp,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Link from "next/link"
import { getUser, clearAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

const items = [
  {
    title: "Home",
    url: "/officer/dashboard",
    icon: Home,
  },
  {
    title: "Surveys",
    url: "/officer/dashboard/surveys",
    icon: Inbox,
  },
  {
    title: "Submissions",
    url: "/officer/dashboard/submissions",
    icon: Calendar,
  }
]

export function AppSidebar() {
  const user = getUser();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-4">
            <span className="text-lg font-medium">Survey Management System</span>
          </div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
               (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 🔽 User Info Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto py-3">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="font-medium text-sm">{user?.name || "Officer User"}</p>
                      <p className="text-muted-foreground text-xs">
                        {user?.email || "officer@example.com"}
                      </p>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
