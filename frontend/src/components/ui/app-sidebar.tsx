import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ROUTES, SIDEBAR_OPTIONS } from "@/constants"
import { useProfileStore, useTokenStore } from "@/store"
import { useQueryClient } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"

export function AppSidebar() {
  const queryClient = useQueryClient()

  const location = useLocation()
  const navigate = useNavigate()
  const { profile, removeProfile } = useProfileStore()
  const { removeToken } = useTokenStore()
  const visibleSidebarOptions = SIDEBAR_OPTIONS.filter((item) => {
    return (
      !item.roles || (profile?.role ? item.roles.includes(profile.role) : false)
    )
  })

  const handleLogout = () => {
    queryClient.clear()
    removeToken()
    removeProfile()

    navigate(ROUTES.AUTH, { replace: true })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-[55px] items-center gap-2 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-11 cursor-default hover:bg-transparent hover:text-sidebar-foreground">
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">
                  Recommendation
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  System
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleSidebarOptions.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(item.route)}
                  >
                    <NavLink to={item.route}>
                      <item.icon />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
              onClick={handleLogout}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
