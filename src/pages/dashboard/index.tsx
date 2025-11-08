"use client"

import * as React from "react"

import DashboardGrid from "@/components/dashboard-grid"

// Import direto dos componentes (sem lazy loading) já que mantemos o dashboard montado
// Isso evita o reload dos gráficos ao voltar ao dashboard
import { ChartCandlestick } from "@/pages/assets/components/chart-candlestick"
import { ChartMarkovChains } from "@/pages/markov-chains/components/chart-markov-chains"
import { ChartVolatilityGarch } from "@/pages/volatility/components/chart-volatility-garch"

type CardType = "candlestick-chart" | "markov-chains" | "volatility-garch"

type DashboardItem = {
  id: string
  type: CardType
  element: React.ReactNode
}

const CARD_TEMPLATES: Record<CardType, { label: string; createElement: (onClose: () => void) => React.ReactNode }> = {
  "candlestick-chart": {
    label: "Gráfico Candlestick",
    createElement: (onClose) => <ChartCandlestick onClose={onClose} />,
  },
  "markov-chains": {
    label: "Cadeias de Markov",
    createElement: (onClose) => <ChartMarkovChains onClose={onClose} />,
  },
  "volatility-garch": {
    label: "Níveis de Volatilidade GARCH",
    createElement: (onClose) => <ChartVolatilityGarch onClose={onClose} />,
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
    const defaultTypes: CardType[] = ["candlestick-chart"]
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


