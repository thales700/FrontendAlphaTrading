"use client"

import React from "react"
import GridLayout, { Layout, WidthProvider } from "react-grid-layout"
import "react-resizable/css/styles.css"
import { toast } from "sonner"

const ResponsiveGridLayout = WidthProvider(GridLayout)

type DashboardItem = {
  id: string
  element: React.ReactNode
}

type DashboardGridProps = {
  storageKey?: string
  items: DashboardItem[]
  isEditable?: boolean
}

const DEFAULT_COLS = 12

// Função para determinar o tamanho inicial baseado no tipo de card
function getInitialSize(itemId: string): { w: number; h: number; minW: number; minH: number } {
  // Cards candlestick precisam de mais espaço
  if (itemId.includes("candlestick-chart")) {
    return {
      w: 8, // Largura maior (8 de 12 colunas)
      h: 10, // Altura maior (10 linhas)
      minW: 6, // Largura mínima
      minH: 8, // Altura mínima
    }
  }
  // Tamanho padrão para outros cards
  return {
    w: 3,
    h: 3,
    minW: 3,
    minH: 3,
  }
}

function loadLayout(storageKey: string): Layout[] | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Layout[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

function saveLayout(storageKey: string, layout: Layout[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(layout))
  } catch {}
}

export function hasSavedLayout(storageKey = "dashboard:grid:layout"): boolean {
  return !!loadLayout(storageKey)
}

export function clearLayout(storageKey = "dashboard:grid:layout") {
  try {
    localStorage.removeItem(storageKey)
  } catch {}
}

export default function DashboardGrid({ storageKey = "dashboard:grid:layout", items, isEditable = true }: DashboardGridProps) {
  const defaultLayout = React.useMemo<Layout[]>(() => {
    // Spread initial cards in a single row by default
    return items.map((item, index) => {
      const size = getInitialSize(item.id)
      // Para candlestick, centralizar melhor na linha
      const x = item.id.includes("candlestick-chart") 
        ? Math.max(0, Math.floor((DEFAULT_COLS - size.w) / 2))
        : (index * 3) % DEFAULT_COLS
      return {
        i: item.id,
        x,
        y: Math.floor((index * 3) / DEFAULT_COLS) * 2,
        ...size,
      }
    })
  }, [items])

  const [layout, setLayout] = React.useState<Layout[] | null>(null)
  const [preventCollisionState, setPreventCollisionState] = React.useState(false)
  const [compactTypeState, setCompactTypeState] = React.useState<"horizontal" | "vertical" | null>(null)
  const idleRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const loaded = loadLayout(storageKey)
    if (loaded) {
      // Filtrar layout para remover items que não existem mais
      const itemIds = new Set(items.map((item) => item.id))
      const filtered = loaded.filter((l) => itemIds.has(l.i))
      // Adicionar novos items que não estão no layout
      const existingIds = new Set(filtered.map((l) => l.i))
      const newItems = items.filter((item) => !existingIds.has(item.id))
      const newLayouts = newItems.map((item, index) => {
        const existingLayout = defaultLayout.find((l) => l.i === item.id)
        if (existingLayout) return existingLayout
        // Calcular posição para novos items
        const maxY = filtered.length > 0 ? Math.max(...filtered.map((l) => l.y + l.h)) : 0
        const size = getInitialSize(item.id)
        // Para candlestick, centralizar melhor na linha
        const x = item.id.includes("candlestick-chart")
          ? Math.max(0, Math.floor((DEFAULT_COLS - size.w) / 2))
          : (index * 3) % DEFAULT_COLS
        return {
          i: item.id,
          x,
          y: maxY + 2,
          ...size,
        }
      })
      setLayout([...filtered, ...newLayouts])
    } else {
      setLayout(defaultLayout)
    }
  }, [storageKey, defaultLayout, items])

  const saveTimer = React.useRef<number | null>(null)

  const handleLayoutChange = React.useCallback(
    (current: Layout[]) => {
      setLayout(current)
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current)
      }
      saveTimer.current = window.setTimeout(() => {
        saveLayout(storageKey, current)
        toast.success("Layout salvo")
      }, 500)
    },
    [storageKey]
  )

  if (!layout) return null

  return (
    <div className="px-4 lg:px-6 relative z-0">
      <ResponsiveGridLayout
        className="layout"
        layout={layout}
        cols={DEFAULT_COLS}
        rowHeight={50}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditable}
        isResizable={isEditable}
        draggableHandle=".drag-handle"
        useCSSTransforms={false}
        compactType={compactTypeState}
        preventCollision={preventCollisionState}
        onDragStart={() => {
          // Enquanto arrasta, deixar sobrepor sem empurrar itens
          setPreventCollisionState(true)
          setCompactTypeState(null)
          if (idleRef.current) {
            window.clearTimeout(idleRef.current)
            idleRef.current = null
          }
        }}
        onDrag={(currentLayout) => {
          // Resetar o timer a cada movimento; quando parar 1s, permite empurrões mas não compacta
          if (idleRef.current) {
            window.clearTimeout(idleRef.current)
          }
          idleRef.current = window.setTimeout(() => {
            setPreventCollisionState(false)
            setCompactTypeState(null)
            setLayout(currentLayout)
          }, 1000)
        }}
        onDragStop={(currentLayout) => {
          // Ao soltar, permite empurrões mas mantém a posição exata (sem compactação)
          if (idleRef.current) {
            window.clearTimeout(idleRef.current)
            idleRef.current = null
          }
          setPreventCollisionState(false)
          setCompactTypeState(null)
          setLayout(currentLayout)
        }}
      >
        {items.map((item) => (
          <div key={item.id} data-grid={layout.find((l) => l.i === item.id)} className="h-full overflow-hidden">
            {item.element}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}


