"use client"

import * as React from "react"
import { IconDragDrop2, IconX } from "@tabler/icons-react"
import quotationsData from "@/mock/symbols/quotations.json"

// Import direto do ApexCharts para evitar reload ao voltar ao dashboard
import Chart from "react-apexcharts"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export const description = "Candlestick chart with technical indicators"

type Timeframe = "daily" | "15min"
type Asset = keyof typeof quotationsData

// Componente memoizado para evitar re-renders desnecessários
export const ChartCandlestick = React.memo(function ChartCandlestick({ onClose }: { onClose?: () => void }) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [chartHeight, setChartHeight] = React.useState(500)
  
  const [selectedAsset, setSelectedAsset] = React.useState<Asset>("AAPL")
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<Timeframe>("daily")
  const [showVolume, setShowVolume] = React.useState(true)

  // Memoizar assets para evitar recalcular
  const assets = React.useMemo(() => Object.keys(quotationsData) as Asset[], [])

  // Calcular altura dinamicamente baseado no container com debounce
  React.useEffect(() => {
    let resizeTimeout: number | null = null
    let debounceTimeout: number | null = null

    const updateHeights = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.clientHeight
        // Apenas um gráfico (candlestick + volume)
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
    const assetData = quotationsData[selectedAsset]
    if (!assetData || !assetData[selectedTimeframe] || assetData[selectedTimeframe].length === 0) {
      return null
    }

    const data = assetData[selectedTimeframe]
    const length = data.length
    const isIntraday = selectedTimeframe === "15min"
    
    // Processar todos os dados em um único loop para melhor performance
    const dates: number[] = new Array(length)
    const opens: number[] = new Array(length)
    const highs: number[] = new Array(length)
    const lows: number[] = new Array(length)
    const closes: number[] = new Array(length)
    const volumes: number[] = new Array(length)
    // Manter mapeamento de índices para timestamps originais
    // Isso remove espaços temporais (fins de semana, feriados, noites) tanto para dados diários quanto intraday
    const timestampMap: Map<number, number> = new Map()

    for (let i = 0; i < length; i++) {
      const item = data[i]
      // Suportar tanto "Date" (diário) quanto "Datetime" (15min)
      const dateValue = (item as any).Datetime || (item as any).Date
      const timestamp = new Date(dateValue).getTime()
      
      // Sempre usar índice sequencial em vez de timestamp
      // Isso remove os espaços temporais (fins de semana, feriados, noites)
      dates[i] = i // Usar índice sequencial
      timestampMap.set(i, timestamp) // Guardar timestamp original para tooltip e labels
      
      opens[i] = item.Open
      highs[i] = item.High
      lows[i] = item.Low
      closes[i] = item.Close
      volumes[i] = item.Volume
    }

    return {
      dates,
      opens,
      highs,
      lows,
      closes,
      volumes,
      timestampMap, // Mapeamento índice -> timestamp original
      isIntraday,
    }
  }, [selectedAsset, selectedTimeframe])

  if (!chartData) {
    return (
      <Card className="@container/card flex h-full flex-col overflow-hidden relative">
        <CardHeader>
          <CardTitle>Gráfico Candlestick</CardTitle>
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

  // Configuração do gráfico principal (Candlestick + Volume) - otimizado
  const candlestickSeries: any[] = React.useMemo(() => {
    if (!chartData) return []
    
    const length = chartData.dates.length
    // Preparar dados do candlestick em um único loop
    const candlestickData: [number, number, number, number, number][] = new Array(length)
    const volumeData: [number, number][] = new Array(length)
    
    for (let i = 0; i < length; i++) {
      candlestickData[i] = [
        chartData.dates[i],
        chartData.opens[i],
        chartData.highs[i],
        chartData.lows[i],
        chartData.closes[i],
      ]
      volumeData[i] = [chartData.dates[i], chartData.volumes[i]]
    }

    // Sempre incluir o candlestick
    const series: any[] = [
      {
        name: "Candlestick",
        type: "candlestick",
        data: candlestickData,
      },
    ]

    // Adicionar volume como série separada se habilitado
    if (showVolume) {
      series.push({
        name: "Volume",
        type: "column",
        data: volumeData,
        yAxisIndex: 1,
      })
    }

    return series
  }, [chartData, showVolume])



  // Criar opções do gráfico com tooltip que acessa showVolume
  const candlestickOptions: any = React.useMemo(() => {
    const showVolumeValue = showVolume
    const isIntraday = chartData?.isIntraday || false
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
      xaxis: {
        type: "numeric", // Sempre usar numeric para remover espaços temporais
        labels: {
          formatter: (value: number) => {
            // Converter índice de volta para timestamp para exibir no label
            const timestamp = timestampMap.get(Math.round(value))
            if (timestamp) {
              const date = new Date(timestamp)
              if (isIntraday) {
                // Para dados intraday, mostrar data e hora
                const hours = date.getHours().toString().padStart(2, '0')
                const minutes = date.getMinutes().toString().padStart(2, '0')
                const day = date.getDate().toString().padStart(2, '0')
                const month = (date.getMonth() + 1).toString().padStart(2, '0')
                return `${day}/${month} ${hours}:${minutes}`
              } else {
                // Para dados diários, mostrar apenas data
                const day = date.getDate().toString().padStart(2, '0')
                const month = (date.getMonth() + 1).toString().padStart(2, '0')
                const year = date.getFullYear().toString().slice(-2)
                return `${day}/${month}/${year}`
              }
            }
            return value.toString()
          },
          rotate: -45,
          rotateAlways: false,
          style: {
            fontSize: isIntraday ? "11px" : "12px",
          },
        },
      },
      yaxis: showVolume
        ? [
            {
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
            {
              title: {
                text: "Volume",
              },
              opposite: true,
              show: false, // Sempre ocultar o eixo Y do volume, apenas mostrar as barras
            },
          ]
        : [
            {
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
          ],
      tooltip: {
        shared: true,
        x: {
          format: isIntraday ? "dd/MM/yyyy HH:mm" : "dd MMM yyyy HH:mm",
        },
        custom: function({ seriesIndex, dataPointIndex, w }: any) {
          if (seriesIndex === 0 && w.globals.initialSeries && w.globals.initialSeries[seriesIndex]) {
            const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
            if (!data || !Array.isArray(data) || data.length < 5) return ''
            
            const [xValue, open, high, low, close] = data
            
            // xValue é sempre um índice, precisamos buscar o timestamp original
            const timestamp = timestampMap.get(Math.round(xValue)) || xValue
            
            // Formatar data conforme o tipo de timeframe
            const dateObj = new Date(timestamp)
            let date: string
            if (isIntraday) {
              date = dateObj.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            } else {
              date = dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            }
            
            // Buscar volume da série de volume se existir
            let volume = 0
            if (showVolumeValue && w.globals.initialSeries.length > 1) {
              const volumeData = w.globals.initialSeries[1].data[dataPointIndex]
              if (volumeData && Array.isArray(volumeData) && volumeData.length >= 2) {
                volume = volumeData[1]
              }
            }
            
            let volumeHtml = ''
            if (showVolumeValue && volume && volume > 0) {
              volumeHtml = `<div style="margin-top: 4px;">Volume: <span style="font-family: monospace;">${volume.toLocaleString('pt-BR')}</span></div>`
            }
            
            return `
              <div style="padding: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="font-weight: 600; margin-bottom: 4px; color: #111827;">${date}</div>
                <div style="margin-top: 4px; font-size: 12px; color: #374151;">
                  <div>Abertura: <span style="font-family: monospace;">${open.toFixed(5)}</span></div>
                  <div>Máxima: <span style="font-family: monospace;">${high.toFixed(5)}</span></div>
                  <div>Mínima: <span style="font-family: monospace;">${low.toFixed(5)}</span></div>
                  <div>Fechamento: <span style="font-family: monospace;">${close.toFixed(5)}</span></div>
                  ${volumeHtml}
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
  }, [chartHeight, showVolume, chartData])

  return (
    <Card ref={cardRef} className="@container/card flex h-full flex-col overflow-hidden relative">
      <CardHeader className="min-h-11 flex-shrink-0">
        {/* Primeira linha: Título e controles principais */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
            <IconDragDrop2 />
          </span>
          <CardTitle className="shrink-0">Gráfico Candlestick</CardTitle>
          <CardDescription className="shrink-0">
            {selectedAsset} - {selectedTimeframe === "daily" ? "Diário" : "15 Minutos"}
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
            <ToggleGroup
              type="single"
              value={selectedTimeframe}
              onValueChange={(value) => value && setSelectedTimeframe(value as Timeframe)}
              variant="outline"
              className="shrink-0"
            >
              <ToggleGroupItem value="daily">Diário</ToggleGroupItem>
              <ToggleGroupItem value="15min">15min</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        {/* Segunda linha: Checkbox de volume */}
        <div className="flex items-center gap-2 flex-wrap mt-2 w-full">
          <div className="flex items-center gap-2 shrink-0">
            <Checkbox
              id="volume"
              checked={showVolume}
              onCheckedChange={(checked) => setShowVolume(checked === true)}
            />
            <Label htmlFor="volume" className="text-xs cursor-pointer">Volume</Label>
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
          {/* Gráfico Principal - Candlestick + Volume */}
          {candlestickSeries && candlestickSeries.length > 0 ? (
            <div style={{ minHeight: `${chartHeight}px` }}>
              <Chart
                key={`candlestick-${showVolume ? 'with-volume' : 'no-volume'}-${selectedAsset}-${selectedTimeframe}`}
                options={candlestickOptions}
                series={candlestickSeries}
                type="candlestick"
                height={chartHeight}
              />
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
})

