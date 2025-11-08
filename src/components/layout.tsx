import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Outlet, useLocation } from "react-router-dom"
import * as React from "react"
import { DashboardPage } from "@/pages/dashboard/page"

export function Layout() {
  const location = useLocation()
  const isDashboard = location.pathname === "/" || location.pathname === "/dashboard"

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="flex w-full p-0"> 
        <AppSidebar variant="inset" />

        <SidebarInset className="w-full ">
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full">
                {/* Dashboard - mantido montado para performance, apenas escondido quando não ativo */}
                <div style={{ display: isDashboard ? "contents" : "none" }}>
                  <DashboardPage />
                </div>
                
                {/* Outras páginas - renderizadas condicionalmente apenas quando não for dashboard */}
                {!isDashboard && <Outlet />}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
