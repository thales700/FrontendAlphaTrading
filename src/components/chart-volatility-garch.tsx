"use client"

import * as React from "react"
import { IconDragDrop2, IconX } from "@tabler/icons-react"

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
import { Button } from "@/components/ui/button"

export const description = "Gráfico de Volatilidade GARCH com níveis de desvio padrão"

type VolatilityModel = "GARCH" | "EGARCH" | "FIGARCH"
type Asset = string

type VolatilityDataPoint = {
  Datetime: string
  Open: number
  High: number
  Low: number
  Close: number
  Volume: number
  volatility: number | null
  volatility_level_1: number | null
  "volatility_level_-1": number | null
  volatility_level_2: number | null
  "volatility_level_-2": number | null
  volatility_level_3: number | null
  "volatility_level_-3": number | null
}

type VolatilityAssetData = {
  [model: string]: {
    normal: VolatilityDataPoint[]
  }
}

type VolatilityData = {
  [asset: string]: VolatilityAssetData
}

export function ChartVolatilityGarch({ onClose }: { onClose?: () => void }) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [chartHeight, setChartHeight] = React.useState(500)
  
  const [selectedAsset, setSelectedAsset] = React.useState<Asset>("AAPL")
  const [selectedModel, setSelectedModel] = React.useState<VolatilityModel>("GARCH")
  const [volatilityData, setVolatilityData] = React.useState<VolatilityData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Carregar dados de volatilidade dinamicamente
  React.useEffect(() => {
    let isMounted = true
    
    async function loadData() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/src/mock/volatility/garch_levels.json')
        if (!response.ok) {
          throw new Error('Falha ao carregar dados de volatilidade')
        }
        
        // Obter texto e substituir NaN por null antes do parse
        const text = await response.text()
        const sanitizedText = text.replace(/:\s*NaN\s*([,}\]])/g, ': null$1')
        const data = JSON.parse(sanitizedText)
        
        if (isMounted) {
          setVolatilityData(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
          console.error('Erro ao carregar dados de volatilidade:', err)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    loadData()
    
    return () => {
      isMounted = false
    }
  }, [])

  // Memoizar assets para evitar recalcular
  const assets = React.useMemo(() => {
    if (!volatilityData) return []
    return Object.keys(volatilityData) as Asset[]
  }, [volatilityData])
  
  const models: VolatilityModel[] = ["GARCH", "EGARCH", "FIGARCH"]

  // Calcular altura dinamicamente baseado no container com debounce
  React.useEffect(() => {
    let resizeTimeout: number | null = null
    let debounceTimeout: number | null = null

    const updateHeights = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.clientHeight
        setChartHeight(Math.max(500, contentHeight - 20))
      }
    }

    const debouncedUpdateHeights = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      debounceTimeout = window.setTimeout(updateHeights, 150)
    }

    // Aguardar um pouco para o DOM estar pronto
    resizeTimeout = window.setTimeout(updateHeights, 100)
    window.addEventListener('resize', debouncedUpdateHeights)
    
    // Usar ResizeObserver para detectar mudanças no container com debounce
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
  }, [])

  // Preparar dados para o gráfico - otimizado com um único loop
  const chartData = React.useMemo(() => {
    if (!volatilityData) return null
    
    const assetData = volatilityData[selectedAsset]
    if (!assetData || !assetData[selectedModel] || !assetData[selectedModel].normal) {
      return null
    }

    const data = assetData[selectedModel].normal
    const length = data.length
    
    // Processar todos os dados em um único loop para melhor performance
    const dates: number[] = new Array(length)
    const opens: number[] = new Array(length)
    const highs: number[] = new Array(length)
    const lows: number[] = new Array(length)
    const closes: number[] = new Array(length)
    const volatilityLevel1Upper: number[] = new Array(length)
    const volatilityLevel1Lower: number[] = new Array(length)
    const volatilityLevel2Upper: number[] = new Array(length)
    const volatilityLevel2Lower: number[] = new Array(length)
    const volatilityLevel3Upper: number[] = new Array(length)
    const volatilityLevel3Lower: number[] = new Array(length)
    const timestampMap: Map<number, number> = new Map()

    for (let i = 0; i < length; i++) {
      const item = data[i]
      const timestamp = new Date(item.Datetime).getTime()
      
      // Usar índice sequencial para remover espaços temporais
      dates[i] = i
      timestampMap.set(i, timestamp)
      
      opens[i] = item.Open
      highs[i] = item.High
      lows[i] = item.Low
      closes[i] = item.Close
      
      // Níveis de volatilidade - usar 0 se for null/undefined
      volatilityLevel1Upper[i] = item.volatility_level_1 ?? 0
      volatilityLevel1Lower[i] = item["volatility_level_-1"] ?? 0
      volatilityLevel2Upper[i] = item.volatility_level_2 ?? 0
      volatilityLevel2Lower[i] = item["volatility_level_-2"] ?? 0
      volatilityLevel3Upper[i] = item.volatility_level_3 ?? 0
      volatilityLevel3Lower[i] = item["volatility_level_-3"] ?? 0
    }

    return {
      dates,
      opens,
      highs,
      lows,
      closes,
      volatilityLevel1Upper,
      volatilityLevel1Lower,
      volatilityLevel2Upper,
      volatilityLevel2Lower,
      volatilityLevel3Upper,
      volatilityLevel3Lower,
      timestampMap,
    }
  }, [selectedAsset, selectedModel, volatilityData])

  // Configuração das séries do gráfico - DEVE estar antes dos returns condicionais
  const chartSeries: any[] = React.useMemo(() => {
    if (!chartData) return []
    
    const length = chartData.dates.length
    
    // Preparar dados do candlestick
    const candlestickData: [number, number, number, number, number][] = new Array(length)
    for (let i = 0; i < length; i++) {
      candlestickData[i] = [
        chartData.dates[i],
        chartData.opens[i],
        chartData.highs[i],
        chartData.lows[i],
        chartData.closes[i],
      ]
    }

    // Preparar dados dos níveis de volatilidade
    const level1UpperData: [number, number][] = new Array(length)
    const level1LowerData: [number, number][] = new Array(length)
    const level2UpperData: [number, number][] = new Array(length)
    const level2LowerData: [number, number][] = new Array(length)
    const level3UpperData: [number, number][] = new Array(length)
    const level3LowerData: [number, number][] = new Array(length)
    
    for (let i = 0; i < length; i++) {
      level1UpperData[i] = [chartData.dates[i], chartData.volatilityLevel1Upper[i]]
      level1LowerData[i] = [chartData.dates[i], chartData.volatilityLevel1Lower[i]]
      level2UpperData[i] = [chartData.dates[i], chartData.volatilityLevel2Upper[i]]
      level2LowerData[i] = [chartData.dates[i], chartData.volatilityLevel2Lower[i]]
      level3UpperData[i] = [chartData.dates[i], chartData.volatilityLevel3Upper[i]]
      level3LowerData[i] = [chartData.dates[i], chartData.volatilityLevel3Lower[i]]
    }

    return [
      {
        name: "Preço",
        type: "candlestick",
        data: candlestickData,
      },
      {
        name: "Volatilidade +3σ",
        type: "line",
        data: level3UpperData,
      },
      {
        name: "Volatilidade -3σ",
        type: "line",
        data: level3LowerData,
      },
      {
        name: "Volatilidade +2σ",
        type: "line",
        data: level2UpperData,
      },
      {
        name: "Volatilidade -2σ",
        type: "line",
        data: level2LowerData,
      },
      {
        name: "Volatilidade +1σ",
        type: "line",
        data: level1UpperData,
      },
      {
        name: "Volatilidade -1σ",
        type: "line",
        data: level1LowerData,
      },
    ]
  }, [chartData])

  // Criar opções do gráfico - DEVE estar antes dos returns condicionais
  const chartOptions: any = React.useMemo(() => {
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
          colors: {
            upward: "#26a69a",
            downward: "#ef5350",
          },
        },
      },
      stroke: {
        width: [1, 2, 2, 2, 2, 2, 2],
        dashArray: [0, 0, 0, 5, 5, 8, 8],
      },
      colors: [
        "#26a69a", // candlestick upward (não usado diretamente)
        "#9c27b0", // +3σ violeta
        "#9c27b0", // -3σ violeta
        "#ff9800", // +2σ laranja
        "#ff9800", // -2σ laranja
        "#2196f3", // +1σ azul
        "#2196f3", // -1σ azul
      ],
      xaxis: {
        type: "numeric",
        labels: {
          formatter: (value: number) => {
            const timestamp = timestampMap.get(Math.round(value))
            if (timestamp) {
              const date = new Date(timestamp)
              const hours = date.getHours().toString().padStart(2, '0')
              const minutes = date.getMinutes().toString().padStart(2, '0')
              const day = date.getDate().toString().padStart(2, '0')
              const month = (date.getMonth() + 1).toString().padStart(2, '0')
              return `${day}/${month} ${hours}:${minutes}`
            }
            return value.toString()
          },
          rotate: -45,
          rotateAlways: false,
          style: {
            fontSize: "11px",
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
        custom: function({ seriesIndex, dataPointIndex, w }: any) {
          if (seriesIndex === 0 && w.globals.initialSeries && w.globals.initialSeries[0]) {
            const data = w.globals.initialSeries[0].data[dataPointIndex]
            if (!data || !Array.isArray(data) || data.length < 5) return ''
            
            const [xValue, open, high, low, close] = data
            const timestamp = timestampMap.get(Math.round(xValue)) || xValue
            
            const dateObj = new Date(timestamp)
            const date = dateObj.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            
            // Buscar níveis de volatilidade
            const level3Upper = w.globals.initialSeries[1]?.data[dataPointIndex]?.[1] || 0
            const level3Lower = w.globals.initialSeries[2]?.data[dataPointIndex]?.[1] || 0
            const level2Upper = w.globals.initialSeries[3]?.data[dataPointIndex]?.[1] || 0
            const level2Lower = w.globals.initialSeries[4]?.data[dataPointIndex]?.[1] || 0
            const level1Upper = w.globals.initialSeries[5]?.data[dataPointIndex]?.[1] || 0
            const level1Lower = w.globals.initialSeries[6]?.data[dataPointIndex]?.[1] || 0
            
            // Função para formatar valor (N/A se for 0 que veio de null)
            const formatValue = (val: number) => {
              return val === 0 ? 'N/A' : val.toFixed(5)
            }
            
            return `
              <div style="padding: 10px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 2px 12px rgba(0,0,0,0.15); min-width: 280px;">
                <div style="font-weight: 600; margin-bottom: 6px; color: #111827; font-size: 13px;">${date}</div>
                
                <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 6px;">
                  <div style="font-weight: 500; font-size: 11px; color: #6b7280; margin-bottom: 3px;">Preço</div>
                  <div style="font-size: 11px; color: #374151; display: grid; grid-template-columns: 1fr 1fr; gap: 2px;">
                    <div>Abertura: <span style="font-family: monospace;">${open.toFixed(5)}</span></div>
                    <div>Fechamento: <span style="font-family: monospace;">${close.toFixed(5)}</span></div>
                    <div>Máxima: <span style="font-family: monospace;">${high.toFixed(5)}</span></div>
                    <div>Mínima: <span style="font-family: monospace;">${low.toFixed(5)}</span></div>
                  </div>
                </div>
                
                <div>
                  <div style="font-weight: 500; font-size: 11px; color: #6b7280; margin-bottom: 3px;">Níveis de Volatilidade</div>
                  <div style="font-size: 11px; color: #374151;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                      <span style="color: #9c27b0;">±3σ:</span>
                      <span style="font-family: monospace;">${formatValue(level3Upper)} / ${formatValue(level3Lower)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                      <span style="color: #ff9800;">±2σ:</span>
                      <span style="font-family: monospace;">${formatValue(level2Upper)} / ${formatValue(level2Lower)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #2196f3;">±1σ:</span>
                      <span style="font-family: monospace;">${formatValue(level1Upper)} / ${formatValue(level1Lower)}</span>
                    </div>
                  </div>
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
        horizontalAlign: "center",
        floating: false,
        offsetY: 0,
        markers: {
          width: 12,
          height: 2,
          radius: 0,
        },
      },
    }
  }, [chartHeight, chartData])

  // Estados de loading e erro - APÓS todos os hooks
  if (isLoading) {
    return (
      <Card className="@container/card flex h-full flex-col overflow-hidden relative">
        <CardHeader>
          <CardTitle>Níveis de Volatilidade GARCH</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
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
        <CardContent className="flex items-center justify-center flex-1">
          <div className="text-muted-foreground">Carregando dados de volatilidade...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="@container/card flex h-full flex-col overflow-hidden relative">
        <CardHeader>
          <CardTitle>Níveis de Volatilidade GARCH</CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
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
        <CardContent className="flex items-center justify-center flex-1">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card className="@container/card flex h-full flex-col overflow-hidden relative">
        <CardHeader>
          <CardTitle>Níveis de Volatilidade GARCH</CardTitle>
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

  return (
    <Card ref={cardRef} className="@container/card flex h-full flex-col overflow-hidden relative">
      <CardHeader className="min-h-11 flex-shrink-0">
        {/* Primeira linha: Título e controles principais */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
            <IconDragDrop2 />
          </span>
          <CardTitle className="shrink-0">Níveis de Volatilidade</CardTitle>
          <CardDescription className="shrink-0">
            {selectedAsset} - Modelo {selectedModel} - 15 Minutos
          </CardDescription>
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            <Select value={selectedAsset} onValueChange={(value) => setSelectedAsset(value as Asset)}>
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
            <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as VolatilityModel)}>
              <SelectTrigger className="w-32 shrink-0" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Segunda linha: Legenda de níveis */}
        <div className="flex items-center gap-4 flex-wrap mt-2 w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5" style={{ backgroundColor: "#2196f3" }}></div>
            <span>±1σ (68%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5" style={{ backgroundColor: "#ff9800" }}></div>
            <span>±2σ (95%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5" style={{ backgroundColor: "#9c27b0" }}></div>
            <span>±3σ (99.7%)</span>
          </div>
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
          {/* Gráfico Principal */}
          {chartSeries && chartSeries.length > 0 ? (
            <div style={{ minHeight: `${chartHeight}px` }}>
              <React.Suspense fallback={
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Carregando gráfico...
                </div>
              }>
                <Chart
                  key={`volatility-${selectedAsset}-${selectedModel}`}
                  options={chartOptions}
                  series={chartSeries}
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

