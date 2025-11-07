"use client"

import * as React from "react"
import { IconDragDrop2, IconX } from "@tabler/icons-react"
import markovData from "@/mock/markov/hidden_markov_model.json"

// Lazy load do Chart para melhorar performance inicial
const Chart = React.lazy(() => 
  import("react-apexcharts").then(module => ({ 
    default: module.default || module 
  }))
)

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const description = "Candlestick chart with Hidden Markov Model states"

type NumStates = 2 | 3
type Asset = keyof typeof markovData

// Cores padrão para cada estado
const DEFAULT_COLORS: Record<number, string> = {
  0: "#26a69a", // Verde para estado 0
  1: "#ef5350", // Vermelho para estado 1
  2: "#ffa726", // Laranja para estado 2
}

export function ChartMarkovChains({ onClose }: { onClose?: () => void }) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [chartHeight, setChartHeight] = React.useState(500)
  
  const [selectedAsset, setSelectedAsset] = React.useState<Asset>("AAPL")
  const [numStates, setNumStates] = React.useState<NumStates>(2)
  
  // Cores para cada estado (usado no gráfico)
  const [stateColors, setStateColors] = React.useState<Record<number, string>>({
    0: DEFAULT_COLORS[0],
    1: DEFAULT_COLORS[1],
    2: DEFAULT_COLORS[2],
  })
  
  // Cores intermediárias para feedback visual imediato no input
  const [tempStateColors, setTempStateColors] = React.useState<Record<number, string>>({
    0: DEFAULT_COLORS[0],
    1: DEFAULT_COLORS[1],
    2: DEFAULT_COLORS[2],
  })
  
  // Refs para os timeouts de debounce
  const debounceTimeouts = React.useRef<Record<number, NodeJS.Timeout>>({})
  
  // useTransition para tornar mudanças de estado não-urgentes menos prioritárias
  const [isPending, startTransition] = React.useTransition()

  // Memoizar assets para evitar recalcular
  const assets = React.useMemo(() => Object.keys(markovData) as Asset[], [])

  // Calcular altura dinamicamente baseado no container com debounce otimizado
  React.useEffect(() => {
    let resizeTimeout: number | null = null
    let debounceTimeout: number | null = null

    const updateHeights = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.clientHeight
        startTransition(() => {
          setChartHeight(Math.max(500, contentHeight - 20))
        })
      }
    }

    const debouncedUpdateHeights = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      // Reduzido de 150ms para 100ms para resposta mais rápida
      debounceTimeout = window.setTimeout(updateHeights, 100)
    }

    resizeTimeout = window.setTimeout(updateHeights, 50)
    window.addEventListener('resize', debouncedUpdateHeights)
    
    const resizeObserver = new ResizeObserver(debouncedUpdateHeights)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current)
    }

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      if (debounceTimeout) clearTimeout(debounceTimeout)
      window.removeEventListener('resize', debouncedUpdateHeights)
      resizeObserver.disconnect()
    }
  }, [startTransition])

  // Preparar dados para o gráfico
  const chartData = React.useMemo(() => {
    const assetData = markovData[selectedAsset]
    if (!assetData) {
      return null
    }

    const stateKey = `${numStates}_states` as "2_states" | "3_states"
    const data = assetData[stateKey]
    
    if (!data || data.length === 0) {
      return null
    }

    const length = data.length
    
    // Processar todos os dados em um único loop
    const dates: number[] = new Array(length)
    const opens: number[] = new Array(length)
    const highs: number[] = new Array(length)
    const lows: number[] = new Array(length)
    const closes: number[] = new Array(length)
    const volumes: number[] = new Array(length)
    const regimes: number[] = new Array(length)
    const timestampMap: Map<number, number> = new Map()

    for (let i = 0; i < length; i++) {
      const item = data[i]
      const dateValue = (item as any).Date
      const timestamp = new Date(dateValue).getTime()
      
      dates[i] = i
      timestampMap.set(i, timestamp)
      
      opens[i] = item.Open
      highs[i] = item.High
      lows[i] = item.Low
      closes[i] = item.Close
      volumes[i] = item.Volume
      regimes[i] = item.regime || 0
    }

    return {
      dates,
      opens,
      highs,
      lows,
      closes,
      volumes,
      regimes,
      timestampMap,
    }
  }, [selectedAsset, numStates])

  if (!chartData) {
    return (
      <Card className="@container/card flex h-full flex-col overflow-hidden relative">
        <CardHeader>
          <CardTitle>Cadeias de Markov</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100 z-10"
            onClick={onClose}
            aria-label="Fechar card"
          >
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </Card>
    )
  }

  // Criar string de hash das cores para usar como dependência
  const stateColorsHash = React.useMemo(() => {
    return JSON.stringify(
      Array.from({ length: numStates }, (_, i) => stateColors[i] || DEFAULT_COLORS[i] || DEFAULT_COLORS[0])
    )
  }, [stateColors, numStates])

  // Configuração do gráfico principal (Candlestick) - otimizado
  // Criar séries separadas por estado para permitir coloração individual
  const candlestickSeries: any[] = React.useMemo(() => {
    if (!chartData) return []
    
    const length = chartData.dates.length
    
    // Pré-calcular cores para cada estado para evitar lookups repetidos
    const stateColorCache: string[] = Array.from({ length: numStates }, (_, i) => 
      stateColors[i] || DEFAULT_COLORS[i] || DEFAULT_COLORS[0]
    )
    
    // Criar arrays de dados separados por estado com capacidade pré-alocada
    const stateDataArrays: Array<any[]> = Array.from({ length: numStates }, () => [])
    
    // Loop otimizado - uma única passagem pelos dados
    for (let i = 0; i < length; i++) {
      const regime = chartData.regimes[i]
      
      // Validar regime antes de acessar
      if (regime >= 0 && regime < numStates) {
        const stateColor = stateColorCache[regime]
        
        // Adicionar candle à série correspondente ao seu estado
        stateDataArrays[regime].push({
          x: chartData.dates[i],
          y: [
            chartData.opens[i],
            chartData.highs[i],
            chartData.lows[i],
            chartData.closes[i],
          ],
          fillColor: stateColor,
          strokeColor: stateColor,
        })
      }
    }

    // Criar uma série para cada estado com sua cor correspondente
    const series: any[] = []
    for (let state = 0; state < numStates; state++) {
      if (stateDataArrays[state].length > 0) {
        series.push({
          name: `Estado ${state}`,
          type: "candlestick",
          data: stateDataArrays[state],
          color: stateColorCache[state], // Aplicar cor diretamente na série
        })
      }
    }

    return series
  }, [chartData, numStates, stateColorsHash])

  // Criar opções do gráfico
  const candlestickOptions: any = React.useMemo(() => {
    const timestampMap = chartData?.timestampMap || new Map()
    
    return {
      chart: {
        type: "candlestick",
        height: chartHeight,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        animations: {
          enabled: false,
        },
      },
      plotOptions: {
        candlestick: {
          // Cores padrão para candles de alta e baixa
          // As cores individuais serão aplicadas via propriedade 'color' de cada série
          colors: {
            upward: "#26a69a",
            downward: "#ef5350",
          },
        },
      },
      // Aplicar cores por série (estado) - uma cor para cada série de estado
      // Isso permite que cada série de estado tenha sua cor personalizada
      colors: (() => {
        const colors: string[] = []
        for (let state = 0; state < numStates; state++) {
          const stateColor = stateColors[state] || DEFAULT_COLORS[state] || DEFAULT_COLORS[0]
          colors.push(stateColor)
        }
        return colors
      })(),
      xaxis: {
        type: "numeric",
        labels: {
          formatter: (value: number) => {
            const timestamp = timestampMap.get(Math.round(value))
            if (timestamp) {
              const date = new Date(timestamp)
              const day = date.getDate().toString().padStart(2, '0')
              const month = (date.getMonth() + 1).toString().padStart(2, '0')
              const year = date.getFullYear().toString().slice(-2)
              return `${day}/${month}/${year}`
            }
            return value.toString()
          },
          rotate: -45,
          rotateAlways: false,
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Preço",
        },
        opposite: true,
        labels: {
          formatter: (value: number) => {
            return value.toFixed(5)
          },
        },
      },
      tooltip: {
        shared: true,
        x: {
          format: "dd MMM yyyy HH:mm",
        },
        custom: function({ seriesIndex, dataPointIndex, w }: any) {
          // Buscar dados de candlestick da série atual
          if (w.globals.initialSeries && w.globals.initialSeries[seriesIndex]) {
            const series = w.globals.initialSeries[seriesIndex]
            
            let data: any = null
            let xValue: number = 0
            let open: number, high: number, low: number, close: number
            
            if (series.type === 'candlestick' && series.data && series.data[dataPointIndex]) {
              const point = series.data[dataPointIndex]
              // Sempre usar objeto com fillColor
              if (point && typeof point === 'object' && Array.isArray(point.y) && point.y.length >= 4) {
                xValue = point.x
                [open, high, low, close] = point.y
                data = point
              }
            }
            
            if (!data) return ''
            
            const timestamp = timestampMap.get(Math.round(xValue)) || xValue
            const dateObj = new Date(timestamp)
            const date = dateObj.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
            
            // Buscar regime
            const regime = chartData?.regimes[Math.round(xValue)] ?? 0
            
            return `
              <div style="padding: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="font-weight: 600; margin-bottom: 4px; color: #111827;">${date}</div>
                <div style="margin-top: 4px; font-size: 12px; color: #374151;">
                  <div>Abertura: <span style="font-family: monospace;">${open.toFixed(5)}</span></div>
                  <div>Máxima: <span style="font-family: monospace;">${high.toFixed(5)}</span></div>
                  <div>Mínima: <span style="font-family: monospace;">${low.toFixed(5)}</span></div>
                  <div>Fechamento: <span style="font-family: monospace;">${close.toFixed(5)}</span></div>
                  <div style="margin-top: 4px;">Estado: <span style="font-family: monospace; font-weight: 600;">${regime}</span></div>
                </div>
              </div>
            `
          }
          return ''
        },
      },
      legend: {
        show: true,
        position: "top",
      },
    }
  }, [chartHeight, chartData, stateColors, numStates])

  // Função otimizada com debounce reduzido para mudanças de cor mais rápidas
  const handleColorChange = React.useCallback((state: number, color: string) => {
    // Atualizar imediatamente o estado temporário para feedback visual
    setTempStateColors(prev => ({
      ...prev,
      [state]: color,
    }))
    
    // Limpar timeout anterior para este estado
    if (debounceTimeouts.current[state]) {
      clearTimeout(debounceTimeouts.current[state])
    }
    
    // Aplicar debounce de 100ms (reduzido de 300ms) antes de atualizar o gráfico
    debounceTimeouts.current[state] = setTimeout(() => {
      startTransition(() => {
        setStateColors(prev => {
          // Criar novo objeto para garantir mudança de referência
          const newColors = {
            ...prev,
            [state]: color,
          }
          return newColors
        })
      })
    }, 100)
  }, [startTransition])
  
  // Limpar timeouts ao desmontar
  React.useEffect(() => {
    return () => {
      Object.values(debounceTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [])
  
  // Sincronizar cores temporárias quando numStates mudar ou na inicialização
  React.useEffect(() => {
    setTempStateColors(prev => {
      const updated = { ...prev }
      for (let i = 0; i < numStates; i++) {
        if (!updated[i]) {
          updated[i] = stateColors[i] || DEFAULT_COLORS[i]
        }
      }
      return updated
    })
  }, [numStates]) // Apenas quando numStates mudar

  return (
    <Card ref={cardRef} className="@container/card flex h-full flex-col overflow-hidden relative">
      <CardHeader className="min-h-11 flex-shrink-0">
        {/* Primeira linha: Título e controles principais */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
            <IconDragDrop2 />
          </span>
          <CardTitle className="shrink-0">Cadeias de Markov</CardTitle>
          <CardDescription className="shrink-0">
            {selectedAsset} - {numStates} Estados
          </CardDescription>
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            <Select 
              value={selectedAsset} 
              onValueChange={(value) => {
                startTransition(() => {
                  setSelectedAsset(value as Asset)
                })
              }}
            >
              <SelectTrigger className="w-32 shrink-0" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset} value={asset}>
                    {asset}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={numStates.toString()}
              onValueChange={(value) => {
                if (value) {
                  startTransition(() => {
                    setNumStates(parseInt(value) as NumStates)
                  })
                }
              }}
              variant="outline"
              className="shrink-0"
            >
              <ToggleGroupItem value="2">2 Estados</ToggleGroupItem>
              <ToggleGroupItem value="3">3 Estados</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        {/* Segunda linha: Seletores de cor - sempre em linha separada */}
        <div className="flex items-center gap-2 flex-wrap mt-2 w-full">
          {Array.from({ length: numStates }, (_, i) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <Label htmlFor={`color-${i}`} className="text-xs whitespace-nowrap">
                Estado {i}:
              </Label>
              <Input
                id={`color-${i}`}
                type="color"
                value={tempStateColors[i] || DEFAULT_COLORS[i]}
                onChange={(e) => handleColorChange(i, e.target.value)}
                className="w-8 h-8 cursor-pointer shrink-0"
              />
            </div>
          ))}
        </div>
      </CardHeader>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100 z-10"
          onClick={onClose}
          aria-label="Fechar card"
        >
          <IconX className="h-4 w-4" />
        </Button>
      )}
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 min-h-0 overflow-auto" ref={contentRef}>
        <div className="space-y-4">
          {candlestickSeries && candlestickSeries.length > 0 ? (
            <div style={{ minHeight: `${chartHeight}px`, opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <React.Suspense fallback={
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Carregando gráfico...
                </div>
              }>
                <Chart
                  key={`markov-${numStates}-${selectedAsset}-${JSON.stringify(stateColors)}`}
                  options={candlestickOptions}
                  series={candlestickSeries}
                  type="candlestick"
                  height={chartHeight}
                />
              </React.Suspense>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              Carregando gráfico...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

