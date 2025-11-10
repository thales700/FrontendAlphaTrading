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

  // Configuração de título e descrição baseado na rota
  const headerConfig = React.useMemo(() => {
    switch (location.pathname) {
      case "/":
      case "/dashboard":
        return {
          title: "Dashboard",
          description: "Visualize e customize seus gráficos de análise financeira em um layout interativo e personalizável"
        }
      case "/assets":
        return {
          title: "Ativos",
          description: "Explore os ativos disponíveis e as funcionalidades do gráfico de candlestick"
        }
      case "/markov-chains":
        return {
          title: "Cadeias de Markov",
          description: "Análise de regimes de mercado usando Modelos Ocultos de Markov (Hidden Markov Models)"
        }
      case "/volatility":
        return {
          title: "Níveis de Volatilidade",
          description: "Análise de volatilidade usando modelos GARCH e suas variantes para previsão de risco"
        }
      default:
        return {}
    }
  }, [location.pathname])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="flex w-full p-0 overflow-x-hidden max-w-full"> 
        <AppSidebar variant="inset" />

        <SidebarInset className="w-full overflow-x-hidden max-w-full">
          <SiteHeader {...headerConfig} />
          <div className="flex flex-1 flex-col overflow-x-hidden max-w-full">
            <div className="@container/main flex flex-1 flex-col gap-2 w-full overflow-x-hidden max-w-full">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full overflow-x-hidden max-w-full">
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
