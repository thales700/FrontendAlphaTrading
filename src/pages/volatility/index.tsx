import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Activity, LineChart, TrendingUp, Filter, Layers, BarChart3 } from "lucide-react"

export function VolatilityPage() {
  const [assets, setAssets] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Carregar lista de ativos dinamicamente
  React.useEffect(() => {
    async function loadAssets() {
      try {
        const response = await fetch('/src/mock/volatility/garch_levels.json')
        if (response.ok) {
          // Obter texto e substituir NaN por null antes do parse
          const text = await response.text()
          const sanitizedText = text.replace(/:\s*NaN\s*([,}\]])/g, ': null$1')
          const data = JSON.parse(sanitizedText)
          setAssets(Object.keys(data))
        }
      } catch (err) {
        console.error('Erro ao carregar ativos:', err)
        // Lista de fallback caso falhe
        setAssets(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAssets()
  }, [])

  const volatilityFeatures = [
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Modelos GARCH",
      description: "Utilize modelos GARCH, EGARCH e FIGARCH para prever a volatilidade do mercado e identificar períodos de risco elevado",
      category: "Modelagem Estatística"
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Múltiplos Modelos",
      description: "Escolha entre GARCH (padrão), EGARCH (captura assimetria) e FIGARCH (memória longa) para análise da volatilidade",
      category: "Configuração"
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      title: "Níveis de Desvio Padrão",
      description: "Visualize bandas de ±1σ (68%), ±2σ (95%) e ±3σ (99.7%) para identificar movimentos extremos de preço",
      category: "Visualização"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Análise Intraday",
      description: "Dados em intervalos de 15 minutos permitem análise precisa da volatilidade ao longo do dia de negociação",
      category: "Análise"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Identificação de Riscos",
      description: "Detecte automaticamente períodos de alta volatilidade e potenciais breakouts fora dos níveis esperados",
      category: "Gestão de Risco"
    },
    {
      icon: <Filter className="h-5 w-5" />,
      title: "Ferramentas Interativas",
      description: "Zoom, pan, seleção de períodos e download de gráficos para análise detalhada dos níveis de volatilidade",
      category: "Interatividade"
    },
  ]

  const modelDescriptions = [
    {
      title: "GARCH",
      fullName: "Generalized Autoregressive Conditional Heteroskedasticity",
      description: "Modelo clássico que captura a variação da volatilidade ao longo do tempo. Assume que choques positivos e negativos têm o mesmo impacto na volatilidade.",
      defaultColor: "#2196f3",
      colorName: "Azul",
      useCase: "Ideal para análise geral de volatilidade em mercados sem assimetria significativa"
    },
    {
      title: "EGARCH",
      fullName: "Exponential GARCH",
      description: "Extensão do GARCH que captura a assimetria na volatilidade, permitindo que choques negativos tenham impacto diferente dos positivos (efeito alavancagem).",
      defaultColor: "#ff9800",
      colorName: "Laranja",
      useCase: "Recomendado para ações onde más notícias aumentam mais a volatilidade que boas notícias"
    },
    {
      title: "FIGARCH",
      fullName: "Fractionally Integrated GARCH",
      description: "Modelo que captura a memória longa na volatilidade, permitindo que choques passados tenham efeito prolongado no tempo.",
      defaultColor: "#9c27b0",
      colorName: "Violeta",
      useCase: "Útil para mercados com persistência de volatilidade de longo prazo"
    },
  ]

  const sigmaLevels = [
    {
      level: "±1σ",
      probability: "68.3%",
      description: "Espera-se que aproximadamente 68% dos movimentos de preço fiquem dentro desta banda. Representa a volatilidade normal do mercado.",
      color: "#2196f3",
      colorName: "Azul"
    },
    {
      level: "±2σ",
      probability: "95.4%",
      description: "Cerca de 95% dos movimentos de preço devem ficar dentro desta banda. Movimentos além deste nível indicam volatilidade elevada.",
      color: "#ff9800",
      colorName: "Laranja"
    },
    {
      level: "±3σ",
      probability: "99.7%",
      description: "Apenas 0.3% dos movimentos de preço devem ultrapassar esta banda. Representa eventos extremos ou \"cisnes negros\".",
      color: "#9c27b0",
      colorName: "Violeta"
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full">
      {/* Seção de O que são Modelos GARCH */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">O que são Modelos GARCH?</h2>
          <p className="text-sm text-muted-foreground">
            Entenda os conceitos fundamentais e aplicações em análise de risco financeiro
          </p>
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              GARCH e Volatilidade Condicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Os <strong>modelos GARCH</strong> (Generalized Autoregressive Conditional Heteroskedasticity) são ferramentas 
              estatísticas desenvolvidas para modelar e prever a volatilidade dos mercados financeiros. Diferentemente de 
              modelos simples que assumem volatilidade constante, os modelos GARCH reconhecem que a volatilidade varia ao 
              longo do tempo e pode ser prevista com base em valores passados.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex gap-3 p-3 bg-background rounded-lg border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Volatilidade Dinâmica</h4>
                  <p className="text-xs text-muted-foreground">
                    Captura como a volatilidade muda ao longo do tempo, permitindo previsões mais precisas
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-background rounded-lg border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Clustering de Volatilidade</h4>
                  <p className="text-xs text-muted-foreground">
                    Identifica períodos onde alta volatilidade tende a ser seguida por alta volatilidade
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
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Funcionalidades do Gráfico de Volatilidade</h2>
          <p className="text-sm text-muted-foreground">
            Recursos disponíveis para análise de volatilidade e identificação de riscos
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {volatilityFeatures.map((feature, index) => (
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

      {/* Seção de Modelos */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Tipos de Modelos Disponíveis</h2>
          <p className="text-sm text-muted-foreground">
            Entenda as diferenças entre GARCH, EGARCH e FIGARCH
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {modelDescriptions.map((model, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{model.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border-2 border-border"
                      style={{ backgroundColor: model.defaultColor }}
                    />
                    <Badge variant="secondary">{model.colorName}</Badge>
                  </div>
                </div>
                <CardDescription className="text-xs font-mono">
                  {model.fullName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {model.description}
                </p>
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-1">Caso de Uso:</p>
                  <p className="text-xs text-muted-foreground">
                    {model.useCase}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Seção de Níveis Sigma */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Interpretação dos Níveis de Desvio Padrão (σ)</h2>
          <p className="text-sm text-muted-foreground">
            Entenda o significado de cada banda de volatilidade no gráfico
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {sigmaLevels.map((sigma, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{sigma.level}</CardTitle>
                    <CardDescription className="text-lg font-semibold mt-1">
                      {sigma.probability}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-2 rounded"
                      style={{ backgroundColor: sigma.color }}
                    />
                    <Badge variant="secondary" className="text-xs">{sigma.colorName}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {sigma.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">📊 Como Interpretar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Os níveis de desvio padrão formam bandas ao redor do preço atual. Quando o preço se aproxima ou 
              ultrapassa essas bandas, isso indica:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
              <li><strong>Dentro de ±1σ:</strong> Movimento de preço normal, sem sinais de alerta</li>
              <li><strong>Entre ±1σ e ±2σ:</strong> Volatilidade acima do normal, atenção redobrada</li>
              <li><strong>Entre ±2σ e ±3σ:</strong> Alta volatilidade, considere reduzir exposição</li>
              <li><strong>Além de ±3σ:</strong> Movimento extremo, possível evento de mercado significativo</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Seção de Ativos Disponíveis */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Ativos com Análise de Volatilidade</h2>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Carregando...' : `${assets.length} ativos disponíveis com modelos GARCH, EGARCH e FIGARCH calculados`}
          </p>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {isLoading ? (
            <div className="col-span-full text-center text-muted-foreground py-8">
              Carregando ativos...
            </div>
          ) : (
            assets.map((asset) => (
              <Card key={asset} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-lg mb-1">{asset}</div>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">GARCH</Badge>
                    <Badge variant="outline" className="text-xs">EGARCH</Badge>
                    <Badge variant="outline" className="text-xs">FIGARCH</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
                <h4 className="font-medium mb-1 text-foreground">Adicione o Card de Níveis de Volatilidade</h4>
                <p className="text-sm text-muted-foreground">
                  No dashboard principal, clique em "Adicionar Card" e selecione "Níveis de Volatilidade GARCH"
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">Selecione o Ativo e Modelo</h4>
                <p className="text-sm text-muted-foreground">
                  Escolha o ativo desejado e o modelo de volatilidade (GARCH, EGARCH ou FIGARCH)
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">Analise os Níveis de Volatilidade</h4>
                <p className="text-sm text-muted-foreground">
                  Observe as bandas de ±1σ, ±2σ e ±3σ e identifique quando o preço se aproxima de níveis extremos
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                4
              </div>
              <div>
                <h4 className="font-medium mb-1 text-foreground">Ajuste sua Estratégia</h4>
                <p className="text-sm text-muted-foreground">
                  Use as informações de volatilidade para ajustar tamanho de posições, stop-loss e estratégias de trading
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
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Aplicações Práticas</h2>
          <p className="text-sm text-muted-foreground">
            Como usar a análise de volatilidade em suas estratégias de trading
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  🎯
                </div>
                Dimensionamento de Posição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Ajuste o tamanho das suas posições com base na volatilidade atual. Em períodos de alta volatilidade 
                (próximo de ±2σ ou ±3σ), reduza o tamanho das posições para gerenciar o risco.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  🛡️
                </div>
                Configuração de Stop-Loss
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Defina stop-loss dinâmicos baseados nos níveis de volatilidade. Use múltiplos de σ para evitar 
                ser interrompido por ruído normal do mercado enquanto protege contra movimentos extremos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  ⚡
                </div>
                Detecção de Breakouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Identifique potenciais breakouts quando o preço ultrapassa consistentemente os níveis de ±2σ. 
                Movimentos além de ±3σ podem indicar mudanças significativas de tendência.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  📈
                </div>
                Estratégias de Opções
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use previsões de volatilidade para estratégias de opções. Venda opções quando a volatilidade está 
                alta (próximo de máximos) e compre quando está baixa (dentro de ±1σ).
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

