import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  IconAlertTriangle,
  IconBox,
  IconChartBar,
  IconDatabase,
  IconHelp,
  IconSettings,
  IconTags,
} from "@tabler/icons-react"

import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

const data = {
  user: {
    name: "管理员",
    email: "admin@example.com",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconChartBar },
    { title: "库存列表", url: "/inventory", icon: IconDatabase },
    { title: "分类管理", url: "#categories", icon: IconTags },
    { title: "入库管理", url: "#inbound", icon: IconBox },
    { title: "预警管理", url: "#alerts", icon: IconAlertTriangle },
  ],
  navSecondary: [
    { title: "设置", url: "#settings", icon: IconSettings },
    { title: "帮助", url: "#help", icon: IconHelp },
  ],
}

function NavButton({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
  const Icon = item.icon

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start gap-2 ${
        isActive
          ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {item.title}
    </Button>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeItem, setActiveItem] = React.useState("/dashboard")

  React.useEffect(() => {
    setActiveItem(location.pathname)
  }, [location.pathname])

  const handleNavClick = (url: string) => {
    setActiveItem(url)
    if (url.startsWith("/")) {
      navigate(url)
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard" className="flex items-center gap-2">
                <IconDatabase className="!size-5" />
                <span className="text-base font-semibold">库存管理系统</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav className="grid gap-1 px-2 py-2">
          {data.navMain.map((item) => (
            <NavButton
              key={item.title}
              item={item}
              isActive={activeItem === item.url}
              onClick={() => handleNavClick(item.url)}
            />
          ))}
        </nav>
        <nav className="grid gap-1 px-2 py-2 mt-4 border-t">
          {data.navSecondary.map((item) => (
            <NavButton
              key={item.title}
              item={item}
              isActive={activeItem === item.url}
              onClick={() => handleNavClick(item.url)}
            />
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
