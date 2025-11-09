import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CandlestickChart, TrendingUp, BarChart3, Clock, Filter } from "lucide-react"
import quotationsData from "@/mock/symbols/quotations.json"

export function AssetsPage() {
  const assets = React.useMemo(() => Object.keys(quotationsData), [])

  // Descrições dos ativos (podem ser expandidas conforme necessário)
  const assetDescriptions: Record<string, { name: string; description: string; sector: string }> = {
    "AAPL": {
      name: "Apple Inc.",
      description: "Empresa americana de tecnologia que projeta, fabrica e comercializa eletrônicos de consumo, software e serviços online.",
      sector: "Tecnologia"
    },
    "GOOGL": {
      name: "Alphabet Inc.",
      description: "Empresa holding multinacional criada através de uma reestruturação da Google, líder em serviços de internet.",
      sector: "Tecnologia"
    },
    "MSFT": {
      name: "Microsoft Corporation",
      description: "Empresa americana de tecnologia que desenvolve, fabrica, licencia e oferece suporte a software, eletrônicos e serviços.",
      sector: "Tecnologia"
    },
    "AMZN": {
      name: "Amazon.com Inc.",
      description: "Empresa americana de comércio eletrônico e computação em nuvem, líder mundial em vendas online.",
      sector: "Varejo/Tecnologia"
    },
    "TSLA": {
      name: "Tesla Inc.",
      description: "Empresa americana de veículos elétricos e energia limpa, pioneira no mercado de carros elétricos premium.",
      sector: "Automotivo"
    },
    "META": {
      name: "Meta Platforms Inc.",
      description: "Empresa americana de tecnologia que opera redes sociais e plataformas de comunicação, incluindo Facebook, Instagram e WhatsApp.",
      sector: "Tecnologia/Social Media"
    },
    "NVDA": {
      name: "NVIDIA Corporation",
      description: "Empresa americana de tecnologia especializada em unidades de processamento gráfico (GPU) e chips de inteligência artificial.",
      sector: "Semicondutores"
    },
  }

  const candlestickFeatures = [
    {
      icon: <CandlestickChart className="h-5 w-5" />,
      title: "Seleção de Ativos",
      description: "Escolha entre diversos ativos disponíveis no mercado (AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, etc.)",
      category: "Configuração"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Timeframes",
      description: "Visualize dados em diferentes intervalos temporais: Diário (daily) ou 15 minutos (15min) para análise intraday",
      category: "Temporalidade"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Volume de Negociação",
      description: "Ative/desative a exibição do volume de negociação em barras no mesmo gráfico para correlacionar com movimentos de preço",
      category: "Indicadores"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Padrões Candlestick",
      description: "Visualize padrões de candlestick japonês com cores diferenciadas (verde para alta, vermelho para baixa)",
      category: "Visualização"
    },
    {
      icon: <Filter className="h-5 w-5" />,
      title: "Ferramentas Interativas",
      description: "Zoom, pan, seleção de períodos e download de gráficos para análise detalhada dos movimentos de preço",
      category: "Interatividade"
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full">
      {/* Seção de Features do Candlestick */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Funcionalidades do Gráfico Candlestick</h2>
          <p className="text-sm text-muted-foreground">
            Recursos disponíveis para análise técnica e visualização de dados de mercado
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candlestickFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {feature.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Seção de Ativos Disponíveis */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Ativos Disponíveis</h2>
          <p className="text-sm text-muted-foreground">
            Lista completa de {assets.length} ativos disponíveis para análise no dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const info = assetDescriptions[asset] || {
              name: asset,
              description: "Ativo financeiro disponível para análise técnica e visualização de dados históricos.",
              sector: "Mercado Financeiro"
            }
            
            return (
              <Card key={asset} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{asset}</CardTitle>
                    <Badge>{info.sector}</Badge>
                  </div>
                  <CardDescription className="font-medium text-foreground/80">
                    {info.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {info.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Dados diários e intraday (15min)</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <Separator />

      {/* Seção de Informações Adicionais */}
      <section className="space-y-4">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Como Utilizar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">Adicione o Card de Candlestick</h4>
                <p className="text-sm text-muted-foreground">
                  No dashboard principal, clique em "Adicionar Card" e selecione "Gráfico Candlestick"
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">Selecione o Ativo</h4>
                <p className="text-sm text-muted-foreground">
                  Use o menu dropdown no cabeçalho do card para escolher o ativo desejado
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">Configure as Visualizações</h4>
                <p className="text-sm text-muted-foreground">
                  Escolha o timeframe (diário ou 15min) e ative/desative o volume conforme necessário
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                4
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">Interaja com o Gráfico</h4>
                <p className="text-sm text-muted-foreground">
                  Use as ferramentas de zoom, pan e seleção para analisar períodos específicos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

