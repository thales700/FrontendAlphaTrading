"use client"

import React from "react"
import GridLayout, { Layout } from "react-grid-layout"
import "react-resizable/css/styles.css"
import { toast } from "sonner"

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
const MIN_COL_WIDTH = 80 // Largura mínima em pixels por coluna

/**
 * Sistema de Colunas Dinâmicas
 * 
 * Este sistema calcula automaticamente o número de colunas disponíveis 
 * baseado na largura do container. Isso permite um posicionamento muito 
 * mais flexível e preciso dos cards no dashboard.
 * 
 * Como funciona:
 * - A cada 80px de largura, o sistema cria uma nova coluna
 * - Mínimo: 12 colunas (para telas pequenas)
 * - Máximo: 100 colunas (para telas muito grandes)
 * - Exemplo: Container de 2400px = 30 colunas (2400 ÷ 80)
 * 
 * Benefícios:
 * ✅ Posicionamento ultra-preciso dos cards
 * ✅ Adaptação automática ao tamanho da tela
 * ✅ Melhor aproveitamento do espaço disponível
 * ✅ Flexibilidade para criar layouts complexos
 */
function calculateColumns(containerWidth: number): number {
  // Calcular quantas colunas cabem no container
  const cols = Math.floor(containerWidth / MIN_COL_WIDTH)
  // Mínimo de 12 colunas, máximo de 100 colunas
  return Math.max(DEFAULT_COLS, Math.min(100, cols))
}

// Função para determinar o tamanho inicial baseado no tipo de card
// Agora recebe o número de colunas para calcular proporcionalmente
function getInitialSize(itemId: string, totalCols: number): { w: number; h: number; minW: number; minH: number } {
  // Card de Markov precisa de ainda mais espaço devido aos controles e gráfico complexo
  if (itemId.includes("markov-chains")) {
    return {
      w: totalCols, // Largura total para garantir espaço para todos os controles
      h: 14, // Altura maior (14 linhas) para acomodar header com controles e gráfico
      minW: 2, // Sem limitação de largura mínima
      minH: 3, // Altura mínima reduzida
    }
  }
  // Cards de volatilidade GARCH com tamanho médio
  if (itemId.includes("volatility-garch")) {
    return {
      w: Math.floor(totalCols * 0.67), // 67% da largura total
      h: 10, // Altura média (10 linhas) para acomodar gráfico e controles
      minW: 2, // Sem limitação de largura mínima
      minH: 3, // Altura mínima reduzida
    }
  }
  // Cards candlestick precisam de mais espaço
  if (itemId.includes("candlestick-chart")) {
    return {
      w: Math.floor(totalCols * 0.67), // 67% da largura total
      h: 10, // Altura maior (10 linhas)
      minW: 2, // Sem limitação de largura mínima
      minH: 3, // Altura mínima reduzida
    }
  }
  // Tamanho padrão para outros cards - 25% da largura
  return {
    w: Math.floor(totalCols / 4),
    h: 3,
    minW: 2, // Sem limitação de largura mínima
    minH: 2, // Altura mínima reduzida
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

// Componente memoizado para evitar re-renders desnecessários
const DashboardGrid = React.memo(function DashboardGrid({ storageKey = "dashboard:grid:layout", items, isEditable = true }: DashboardGridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = React.useState<number>(1200) // Largura padrão inicial
  const [dynamicCols, setDynamicCols] = React.useState<number>(DEFAULT_COLS)
  
  // Calcular largura do container e número de colunas dinâmico
  React.useLayoutEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        if (width > 0) {
          setContainerWidth(width)
          const cols = calculateColumns(width)
          setDynamicCols(cols)
        }
      }
    }
    
    // Calcular imediatamente
    updateWidth()
    
    // Também calcular após um pequeno delay para garantir que o DOM está pronto
    const timeoutId = setTimeout(updateWidth, 0)
    
    // Observar mudanças de tamanho do container
    const resizeObserver = new ResizeObserver(() => {
      updateWidth()
    })
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, []) // Executar apenas uma vez na montagem

  const defaultLayout = React.useMemo<Layout[]>(() => {
    // Spread initial cards in a single row by default
    return items.map((item, index) => {
      const size = getInitialSize(item.id, dynamicCols)
      // Para candlestick, centralizar melhor na linha
      const x = item.id.includes("candlestick-chart") 
        ? Math.max(0, Math.floor((dynamicCols - size.w) / 2))
        : (index * Math.floor(dynamicCols / 4)) % dynamicCols
      return {
        i: item.id,
        x,
        y: Math.floor((index * Math.floor(dynamicCols / 4)) / dynamicCols) * 2,
        ...size,
      }
    })
  }, [items, dynamicCols])

  const [layout, setLayout] = React.useState<Layout[] | null>(null)
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
        const size = getInitialSize(item.id, dynamicCols)
        // Para candlestick, centralizar melhor na linha
        const x = item.id.includes("candlestick-chart")
          ? Math.max(0, Math.floor((dynamicCols - size.w) / 2))
          : (index * Math.floor(dynamicCols / 4)) % dynamicCols
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
  }, [storageKey, defaultLayout, items, dynamicCols])

  const saveTimer = React.useRef<number | null>(null)
  const isDraggingRef = React.useRef(false)

  const handleLayoutChange = React.useCallback(
    (current: Layout[]) => {
      // Apenas atualizar o layout se não estiver arrastando para evitar empurrões automáticos
      if (!isDraggingRef.current) {
        setLayout(current)
        if (saveTimer.current) {
          window.clearTimeout(saveTimer.current)
        }
        saveTimer.current = window.setTimeout(() => {
          saveLayout(storageKey, current)
          toast.success("Layout salvo")
        }, 500)
      }
    },
    [storageKey]
  )

  if (!layout) return null

  return (
    <div ref={containerRef} className="dashboard-scroll-container px-4 lg:px-6 relative z-0 overflow-auto">
      <div className="min-w-max pb-8">
        <GridLayout
          className="layout"
          layout={layout}
          width={Math.max(containerWidth, 2000)} // Largura mínima para permitir posicionamento livre
          cols={dynamicCols} // Usar número de colunas dinâmico baseado na largura
          rowHeight={50}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          isDraggable={isEditable}
          isResizable={isEditable}
          draggableHandle=".drag-handle"
          useCSSTransforms={false}
          compactType={null} // Nunca compactar - permite posicionamento livre
          preventCollision={true} // Prevenir colisão mas permitir sobreposição
          allowOverlap={true} // Permitir sobreposição total dos cards
          onDragStart={() => {
            // Marcar que está arrastando
            isDraggingRef.current = true
            if (idleRef.current) {
              window.clearTimeout(idleRef.current)
              idleRef.current = null
            }
          }}
          onDrag={() => {
            // Não fazer nada durante o arrasto - apenas permitir movimento
          }}
          onDragStop={(currentLayout) => {
            // Desmarcar arrasto e salvar posição exata
            isDraggingRef.current = false
            if (idleRef.current) {
              window.clearTimeout(idleRef.current)
              idleRef.current = null
            }
            setLayout(currentLayout)
            // Salvar layout imediatamente após soltar
            if (saveTimer.current) {
              window.clearTimeout(saveTimer.current)
            }
            saveTimer.current = window.setTimeout(() => {
              saveLayout(storageKey, currentLayout)
              toast.success("Layout salvo")
            }, 500)
          }}
          onResizeStart={() => {
            // Marcar que está redimensionando
            isDraggingRef.current = true
            if (idleRef.current) {
              window.clearTimeout(idleRef.current)
              idleRef.current = null
            }
          }}
          onResize={() => {
            // Não fazer nada durante o redimensionamento
          }}
          onResizeStop={(currentLayout) => {
            // Salvar também após redimensionar
            isDraggingRef.current = false
            setLayout(currentLayout)
            if (saveTimer.current) {
              window.clearTimeout(saveTimer.current)
            }
            saveTimer.current = window.setTimeout(() => {
              saveLayout(storageKey, currentLayout)
              toast.success("Layout salvo")
            }, 500)
          }}
        >
          {items.map((item) => (
            <div key={item.id} data-grid={layout.find((l) => l.i === item.id)} className="h-full overflow-hidden">
              {item.element}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  )
})

export default DashboardGrid


