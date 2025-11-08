import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Workflow, Palette, GitBranch, TrendingUp, Filter, Layers } from "lucide-react"
import markovData from "@/mock/markov/hidden_markov_model.json"

export function MarkovChainsPage() {
  const assets = React.useMemo(() => Object.keys(markovData), [])

  const markovFeatures = [
    {
      icon: <Workflow className="h-5 w-5" />,
      title: "Modelos Ocultos de Markov (HMM)",
      description: "Identifique regimes de mercado usando Hidden Markov Models, uma técnica estatística que detecta estados ocultos em séries temporais financeiras",
      category: "Análise Estatística"
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Estados Configuráveis",
      description: "Escolha entre modelos de 2 ou 3 estados para classificar os diferentes regimes de mercado (ex: alta volatilidade, baixa volatilidade, tendência)",
      category: "Configuração"
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Personalização Visual",
      description: "Customize as cores de cada estado para facilitar a identificação visual dos diferentes regimes no gráfico candlestick",
      category: "Visualização"
    },
    {
      icon: <GitBranch className="h-5 w-5" />,
      title: "Transições de Estado",
      description: "Visualize claramente as mudanças de regime ao longo do tempo através das cores diferenciadas dos candles",
      category: "Análise"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Identificação de Padrões",
      description: "Detecte automaticamente padrões e comportamentos de mercado através da classificação em estados distintos",
      category: "Inteligência"
    },
    {
      icon: <Filter className="h-5 w-5" />,
      title: "Ferramentas Interativas",
      description: "Zoom, pan, seleção de períodos e download de gráficos para análise detalhada dos regimes identificados",
      category: "Interatividade"
    },
  ]

  const stateDescriptions = [
    {
      title: "Estado 0",
      description: "Normalmente representa um regime de baixa volatilidade ou mercado calmo, com movimentos de preço mais estáveis e previsíveis.",
      defaultColor: "#26a69a",
      colorName: "Verde"
    },
    {
      title: "Estado 1",
      description: "Geralmente indica um regime de alta volatilidade ou mercado turbulento, com movimentos de preço mais bruscos e imprevisíveis.",
      defaultColor: "#ef5350",
      colorName: "Vermelho"
    },
    {
      title: "Estado 2",
      description: "Representa um regime intermediário ou de transição, capturando comportamentos que não se encaixam completamente nos outros estados.",
      defaultColor: "#ffa726",
      colorName: "Laranja"
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Cadeias de Markov</h1>
        <p className="text-muted-foreground">
          Análise de regimes de mercado usando Modelos Ocultos de Markov (Hidden Markov Models)
        </p>
      </div>

      <Separator />

      {/* Seção de O que são Cadeias de Markov */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">O que são Cadeias de Markov?</h2>
          <p className="text-sm text-muted-foreground">
            Entenda os conceitos fundamentais e aplicações em análise financeira
          </p>
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-6 w-6 text-primary" />
              Hidden Markov Models (HMM) em Finanças
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Os <strong>Modelos Ocultos de Markov</strong> são ferramentas estatísticas poderosas que permitem identificar 
              diferentes "estados" ou "regimes" nos mercados financeiros. Esses estados são "ocultos" porque não podem ser 
              observados diretamente, mas podem ser inferidos a partir dos dados de preço e volume.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex gap-3 p-3 bg-background rounded-lg border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Detecção de Regimes</h4>
                  <p className="text-xs text-muted-foreground">
                    Identifique automaticamente diferentes condições de mercado (tendência, lateralização, volatilidade)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-background rounded-lg border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Probabilidades de Transição</h4>
                  <p className="text-xs text-muted-foreground">
                    Estime a probabilidade de mudar de um regime para outro no futuro
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Seção de Features */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Funcionalidades do Gráfico de Cadeias de Markov</h2>
          <p className="text-sm text-muted-foreground">
            Recursos disponíveis para análise de regimes e visualização de estados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {markovFeatures.map((feature, index) => (
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

      {/* Seção de Estados */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Interpretação dos Estados</h2>
          <p className="text-sm text-muted-foreground">
            Entenda o significado de cada estado identificado pelo modelo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stateDescriptions.map((state, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{state.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border-2 border-border"
                      style={{ backgroundColor: state.defaultColor }}
                    />
                    <Badge variant="secondary">{state.colorName}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {state.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">📝 Nota Importante</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A interpretação exata de cada estado pode variar dependendo do ativo e do período analisado. 
              O modelo aprende automaticamente os padrões dos dados, portanto, é importante analisar o contexto 
              histórico e as características específicas de cada regime identificado. As cores podem ser 
              personalizadas no gráfico para facilitar sua análise.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Seção de Ativos Disponíveis */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Ativos com Análise HMM</h2>
          <p className="text-sm text-muted-foreground">
            {assets.length} ativos disponíveis com modelos de 2 e 3 estados calculados
          </p>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {assets.map((asset) => (
            <Card key={asset} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="font-semibold text-lg mb-1">{asset}</div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">2 Estados</Badge>
                  <Badge variant="outline" className="text-xs">3 Estados</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Seção de Como Utilizar */}
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
                <h4 className="font-medium mb-1">Adicione o Card de Cadeias de Markov</h4>
                <p className="text-sm text-muted-foreground">
                  No dashboard principal, clique em "Adicionar Card" e selecione "Cadeias de Markov"
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium mb-1">Selecione o Ativo e Número de Estados</h4>
                <p className="text-sm text-muted-foreground">
                  Escolha o ativo desejado e defina se deseja usar modelo de 2 ou 3 estados
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium mb-1">Personalize as Cores dos Estados</h4>
                <p className="text-sm text-muted-foreground">
                  Use os seletores de cor para definir cores que facilitem sua análise visual dos regimes
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                4
              </div>
              <div>
                <h4 className="font-medium mb-1">Analise os Regimes Identificados</h4>
                <p className="text-sm text-muted-foreground">
                  Observe as transições de estados ao longo do tempo e identifique padrões nos regimes de mercado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Seção de Aplicações Práticas */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Aplicações Práticas</h2>
          <p className="text-sm text-muted-foreground">
            Como usar a análise de regimes em suas estratégias de trading
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  💡
                </div>
                Gestão de Risco
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Ajuste o tamanho das posições e stop-loss baseado no regime atual. Em regimes de alta volatilidade, 
                reduza a exposição e aumente as margens de segurança.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  📊
                </div>
                Seleção de Estratégias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Diferentes regimes favorecem diferentes estratégias. Use estratégias de tendência em regimes estáveis 
                e estratégias de reversão à média em regimes voláteis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  ⚡
                </div>
                Detecção de Mudanças
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Identifique rapidamente quando o mercado muda de regime, permitindo ajustes proativos na sua 
                estratégia antes de grandes movimentos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  🎯
                </div>
                Otimização de Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use a informação dos regimes para rebalancear o portfolio, aumentando ativos em regimes favoráveis 
                e reduzindo exposição em regimes desfavoráveis.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

