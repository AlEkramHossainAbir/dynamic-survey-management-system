"use client"

import {
  Calendar,
  Home,
  Inbox,
  Settings,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"



import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const items = [
  {
    title: "Home",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Surveys",
    url: "/admin/dashboard/surveys",
    icon: Inbox,
  },
  {
    title: "Submissions",
    url: "/admin/dashboard/submissions",
    icon: Calendar,
  }
]

export function AppSidebar() {
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
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
          <Avatar>
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>

          <div className="text-sm leading-tight">
            <p className="font-medium">Abir Hossain</p>
            <p className="text-muted-foreground text-xs">
              abir@example.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
