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
    return items.map((item, index) => ({
      i: item.id,
      x: (index * 3) % DEFAULT_COLS,
      y: Math.floor((index * 3) / DEFAULT_COLS) * 2,
      w: 3,
      h: 3,
      minW: 3,
      minH: 3,
    }))
  }, [items])

  const [layout, setLayout] = React.useState<Layout[] | null>(null)

  React.useEffect(() => {
    const loaded = loadLayout(storageKey)
    setLayout(loaded ?? defaultLayout)
  }, [storageKey, defaultLayout])

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
        compactType="horizontal"
        preventCollision={false}
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


