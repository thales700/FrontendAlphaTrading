"use client"

import * as React from "react"
// import { IconDragDrop2, IconTrendingDown, IconTrendingUp, IconX } from "@tabler/icons-react"

// import { Badge } from "@/components/ui/badge"
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import DashboardGrid from "@/components/dashboard-grid"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartCandlestick } from "@/components/chart-candlestick"
import { ChartMarkovChains } from "@/components/chart-markov-chains"

type CardType = /* "total-revenue" | "new-customers" | "active-accounts" | "growth-rate" | "total-visitors" | */ "candlestick-chart" | "markov-chains"

type DashboardItem = {
  id: string
  type: CardType
  element: React.ReactNode
}

const CARD_TEMPLATES: Record<CardType, { label: string; createElement: (onClose: () => void) => React.ReactNode }> = {
  /* "total-revenue": {
    label: "Total Revenue",
    createElement: (onClose) => (
      <Card className="@container/card h-full overflow-hidden relative">
        <CardHeader className="min-h-11">
          <div className="flex items-center gap-2">
            <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
              <IconDragDrop2 />
            </span>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words">
              $1,250.00
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </div>
        </CardHeader>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100 z-10"
          onClick={onClose}
          aria-label="Fechar card"
        >
          <IconX className="h-4 w-4" />
        </Button>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
    ),
  },
  "new-customers": {
    label: "New Customers",
    createElement: (onClose) => (
      <Card className="@container/card h-full overflow-hidden relative">
        <CardHeader className="min-h-11">
          <div className="flex items-center gap-2">
            <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
              <IconDragDrop2 />
            </span>
            <CardDescription>New Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words">
              1,234
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingDown />
                -20%
              </Badge>
            </CardAction>
          </div>
        </CardHeader>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100 z-10"
          onClick={onClose}
          aria-label="Fechar card"
        >
          <IconX className="h-4 w-4" />
        </Button>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>
    ),
  },
  "active-accounts": {
    label: "Active Accounts",
    createElement: (onClose) => (
      <Card className="@container/card h-full overflow-hidden relative">
        <CardHeader className="min-h-11">
          <div className="flex items-center gap-2">
            <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
              <IconDragDrop2 />
            </span>
            <CardDescription>Active Accounts</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words">
              45,678
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </div>
        </CardHeader>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100 z-10"
          onClick={onClose}
          aria-label="Fechar card"
        >
          <IconX className="h-4 w-4" />
        </Button>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
    ),
  },
  "growth-rate": {
    label: "Growth Rate",
    createElement: (onClose) => (
      <Card className="@container/card h-full overflow-hidden relative">
        <CardHeader className="min-h-11">
          <div className="flex items-center gap-2">
            <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
              <IconDragDrop2 />
            </span>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words">
              4.5%
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +4.5%
              </Badge>
            </CardAction>
          </div>
        </CardHeader>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100 z-10"
          onClick={onClose}
          aria-label="Fechar card"
        >
          <IconX className="h-4 w-4" />
        </Button>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    ),
  },
  "total-visitors": {
    label: "Total Visitors (Gráfico)",
    createElement: (onClose) => <ChartAreaInteractive onClose={onClose} />,
  }, */
  "candlestick-chart": {
    label: "Gráfico Candlestick",
    createElement: (onClose) => <ChartCandlestick onClose={onClose} />,
  },
  "markov-chains": {
    label: "Cadeias de Markov",
    createElement: (onClose) => <ChartMarkovChains onClose={onClose} />,
  },
}

export function MainDashboard({ storageKey = "dashboard:grid:main", isEditable = true, onAddCardRequest }: { storageKey?: string; isEditable?: boolean; onAddCardRequest?: (addCard: (type: CardType) => void) => void }) {
  const cardsStorageKey = `${storageKey}:cards`
  
  const [items, setItems] = React.useState<DashboardItem[]>(() => {
    // Tentar carregar cards salvos do localStorage
    try {
      const savedCards = localStorage.getItem(cardsStorageKey)
      if (savedCards) {
        const parsed = JSON.parse(savedCards) as Array<{ id: string; type: CardType }>
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({
            id: item.id,
            type: item.type,
            element: null as React.ReactNode,
          }))
        }
      }
    } catch (error) {
      console.error("Erro ao carregar cards salvos:", error)
    }
    
    // Inicializar com cards padrão se não houver cards salvos
    const defaultTypes: CardType[] = [/* "total-revenue", "new-customers", "active-accounts", "growth-rate", "total-visitors", */ "candlestick-chart"]
    return defaultTypes.map((type) => ({
      id: type,
      type,
      element: null as React.ReactNode, // Será criado no render
    }))
  })
  
  // Salvar cards no localStorage sempre que mudarem
  React.useEffect(() => {
    try {
      const cardsToSave = items.map((item) => ({
        id: item.id,
        type: item.type,
      }))
      localStorage.setItem(cardsStorageKey, JSON.stringify(cardsToSave))
    } catch (error) {
      console.error("Erro ao salvar cards:", error)
    }
  }, [items, cardsStorageKey])

  const removeCard = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    // Limpar o layout do card removido - o DashboardGrid gerencia isso automaticamente,
    // mas podemos limpar manualmente também para garantir
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const layout = JSON.parse(raw)
        const filtered = layout.filter((l: any) => l.i !== id)
        localStorage.setItem(storageKey, JSON.stringify(filtered))
      }
    } catch {}
  }, [storageKey])

  const addCard = React.useCallback((type: CardType) => {
    const id = `${type}-${Date.now()}`
    setItems((prev) => [...prev, { id, type, element: null }])
  }, [])

  // Expor função para adicionar card
  React.useEffect(() => {
    if (onAddCardRequest) {
      onAddCardRequest(addCard)
    }
  }, [onAddCardRequest, addCard])

  // Criar elementos dos cards com função de fechar
  const dashboardItems = React.useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      element: CARD_TEMPLATES[item.type].createElement(() => removeCard(item.id)),
    }))
  }, [items, removeCard])

  return (
    <DashboardGrid
      storageKey={storageKey}
      isEditable={isEditable}
      items={dashboardItems}
    />
  )
}

// Exportar tipos e templates para uso externo
export type { CardType }
export { CARD_TEMPLATES }


