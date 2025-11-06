import { AppSidebar } from "@/components/app-sidebar"
 
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
 
import { MainDashboard, CARD_TEMPLATES, type CardType } from "@/components/main-dashboard"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { clearLayout } from "@/components/dashboard-grid"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconPlus } from "@tabler/icons-react"

 

export default function Page() {
  const [isEditing, setIsEditing] = React.useState(false)
  const [layoutVersion, setLayoutVersion] = React.useState(0)
  const addCardRef = React.useRef<((type: CardType) => void) | null>(null)

  function handleResetLayouts() {
    clearLayout("dashboard:grid:layout")
    clearLayout("dashboard:grid:charts")
    clearLayout("dashboard:grid:main")
    setLayoutVersion((v) => v + 1)
    setIsEditing(false)
  }

  function handleAddCardRequest(addCard: (type: CardType) => void) {
    addCardRef.current = addCard
  }

  function handleAddCard(type: CardType) {
    if (addCardRef.current) {
      addCardRef.current(type)
    }
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* TODO resolvido: usar largura dinâmica com flex ao invés de vw */}
      <div className="flex w-full p-0"> 
        <AppSidebar variant="inset" />

        <SidebarInset className="w-full ">
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 w-full">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full">
                <div className="flex items-center justify-between px-4 lg:px-6 sticky top-[var(--header-height)] z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">Modo {isEditing ? "edição" : "visualização"}</div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <IconPlus className="h-4 w-4" />
                          Adicionar Card
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {Object.entries(CARD_TEMPLATES).map(([type, template]) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => handleAddCard(type as CardType)}
                          >
                            {template.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing((v) => !v)}>
                      {isEditing ? "Concluir edição" : "Editar layout"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleResetLayouts}>
                      Redefinir layout
                    </Button>
                  </div>
                </div>
                <MainDashboard 
                  isEditable={isEditing} 
                  storageKey="dashboard:grid:main" 
                  key={`main-${layoutVersion}`}
                  onAddCardRequest={handleAddCardRequest}
                />
              </div>
            </div>
          </div>
        </SidebarInset>

      </div>

    </SidebarProvider>
  )
}
