# FinancialDash - Frontend 🎨

Interface web moderna e interativa para análise financeira com dashboard personalizável, gráficos em tempo real e visualizações de dados de mercado.

<<<<<<< HEAD
> **Repositório Original**: [FrontendAlphaTrading](https://github.com/thales700/FrontendAlphaTrading)

## 📝 Sobre

O frontend do FinancialDash é uma aplicação web construída com React e TypeScript que oferece:
=======
> **Repositório Original**: [AlphaTradingDashboard](https://github.com/thales700/alphaTradingDashboard/tree/main)

## 📝 Sobre

O frontend do AlphaTradingDashboard é uma aplicação web construída com React e TypeScript que oferece:
>>>>>>> 7b1da332b56a078a5435fe904ba1eadbb2fab4c4

- **Dashboard Personalizável**: Layout drag-and-drop com widgets reorganizáveis
- **Gráficos Interativos**: Visualizações de dados usando Recharts e ApexCharts
- **Análise de Ativos**: Gráficos de candlestick e áreas interativas
- **Regimes de Markov**: Visualização de estados de mercado identificados por HMM
- **Volatilidade**: Gráficos de volatilidade usando modelos GARCH
- **Interface Responsiva**: Design adaptável para desktop, tablet e mobile
- **Tema Claro/Escuro**: Suporte a múltiplos temas
- **Componentes Reutilizáveis**: Biblioteca de componentes UI baseada em Radix UI

## 🛠️ Tecnologias

### Core
- **React 19**: Biblioteca JavaScript para interfaces de usuário
- **TypeScript**: Superset tipado do JavaScript
- **Vite**: Build tool rápida e moderna
- **React Router DOM**: Roteamento no lado do cliente

### UI & Estilização
- **TailwindCSS 4**: Framework CSS utilitário
- **Radix UI**: Componentes acessíveis e sem estilo
- **Lucide React**: Biblioteca de ícones
- **Tabler Icons**: Ícones adicionais
- **next-themes**: Gerenciamento de temas

### Gráficos & Visualizações
- **Recharts**: Biblioteca de gráficos composable
- **ApexCharts**: Gráficos avançados e interativos
- **react-apexcharts**: Wrapper React para ApexCharts

### Layout & Interatividade
- **react-grid-layout**: Sistema de grid drag-and-drop
- **@dnd-kit**: Toolkit de drag and drop
- **react-resizable**: Componentes redimensionáveis
- **sonner**: Notificações toast elegantes
- **vaul**: Drawer component

### Tabelas & Dados
- **@tanstack/react-table**: Tabelas poderosas e flexíveis

### Validação
- **zod**: Schema validation com TypeScript

## 📁 Estrutura do Projeto

```
frontend/
│
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                  # Componentes UI base (Radix UI)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── app-sidebar.tsx      # Barra lateral da aplicação
│   │   ├── dashboard-grid.tsx   # Grid drag-and-drop do dashboard
│   │   ├── layout.tsx           # Layout principal
│   │   ├── nav-main.tsx         # Navegação principal
│   │   ├── nav-user.tsx         # Menu do usuário
│   │   └── site-header.tsx      # Cabeçalho do site
│   │
│   ├── pages/                   # Páginas da aplicação
│   │   ├── dashboard/           # Dashboard principal
│   │   │   ├── components/
│   │   │   │   └── section-cards.tsx
│   │   │   ├── index.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── assets/              # Página de análise de ativos
│   │   │   ├── components/
│   │   │   │   ├── chart-area-interactive.tsx
│   │   │   │   └── chart-candlestick.tsx
│   │   │   └── index.tsx
│   │   │
│   │   ├── markov-chains/       # Página de Markov
│   │   │   ├── components/
│   │   │   │   └── chart-markov-chains.tsx
│   │   │   └── index.tsx
│   │   │
│   │   └── volatility/          # Página de volatilidade
│   │       ├── components/
│   │       │   └── chart-volatility-garch.tsx
│   │       └── index.tsx
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   └── use-mobile.ts        # Hook para detecção de mobile
│   │
│   ├── lib/                     # Utilitários e helpers
│   │   └── utils.ts             # Funções utilitárias
│   │
│   ├── mock/                    # Dados mockados para desenvolvimento
│   │   ├── markov/
│   │   │   └── hidden_markov_model.json
│   │   ├── symbols/
│   │   │   └── quotations.json
│   │   └── volatility/
│   │       └── garch_levels.json
│   │
│   ├── app/                     # Configurações da aplicação
│   │   └── globals.css          # Estilos globais
│   │
│   ├── App.tsx                  # Componente raiz
│   ├── main.tsx                 # Ponto de entrada
│   └── index.css                # Estilos principais
│
├── public/                      # Arquivos estáticos
│   └── vite.svg                 # Logo
│
├── components.json              # Configuração shadcn/ui
├── eslint.config.js             # Configuração ESLint
├── tsconfig.json                # Configuração TypeScript
├── tsconfig.app.json            # Config TypeScript da aplicação
├── tsconfig.node.json           # Config TypeScript do Node
├── vite.config.ts               # Configuração Vite
├── package.json                 # Dependências e scripts
└── Dockerfile                   # Container Docker
```

## 🚀 Como Rodar

### Opção 1: Com Docker (Recomendado)

```bash
# Na raiz do projeto
docker-compose up frontend

# Ou apenas o frontend
cd frontend
docker build -t financialdash-frontend .
docker run -p 5173:5173 financialdash-frontend
<<<<<<< HEAD
=======
```

### Opção 2: Ambiente Local

#### 1. Pré-requisitos

- Node.js 20+ e npm instalados

#### 2. Instalar dependências

```bash
cd frontend
npm install
```

#### 3. Configurar variáveis de ambiente (opcional)

Crie um arquivo `.env` na pasta `frontend`:

```env
VITE_API_URL=http://localhost:8000
```

#### 4. Executar em modo desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:5173

#### 5. Build para produção

```bash
# Gerar build otimizado
npm run build

# Preview do build de produção
npm run preview
```

## 📱 Funcionalidades

### Dashboard Principal
- **Layout Personalizável**: Arraste e solte widgets para reorganizar
- **Persistência**: Layout salvo no localStorage
- **Cards Informativos**: Resumo de métricas principais
- **Gráficos de Resumo**: Visualizações rápidas de dados

### Análise de Ativos
- **Gráfico de Candlestick**: Visualização OHLC (Open, High, Low, Close)
- **Gráfico de Área Interativo**: Dados históricos com zoom e pan
- **Múltiplos Símbolos**: Suporte para diversos ativos financeiros
- **Intervalos de Tempo**: Seleção de granularidade (diário, semanal, mensal)

### Regimes de Markov
- **Visualização de Estados**: Identificação de regimes de mercado
- **Gráficos de Probabilidade**: Probabilidades de transição entre estados
- **Cores por Regime**: Diferenciação visual de estados de mercado
- **Análise Temporal**: Evolução dos regimes ao longo do tempo

### Volatilidade GARCH
- **Níveis de Volatilidade**: Visualização de diferentes níveis
- **Gráficos Interativos**: Zoom, pan e tooltips informativos
- **Modelos Configuráveis**: Suporte para GARCH, ARCH, EGARCH
- **Distribuições**: Normal, Student-t, Skewed-t

## 🎨 Componentes UI

O projeto utiliza uma biblioteca de componentes baseada em **Radix UI** e estilizada com **TailwindCSS**:

### Componentes Disponíveis
- `Button`: Botões com variantes e tamanhos
- `Card`: Containers para conteúdo
- `Chart`: Wrapper para gráficos
- `Table`: Tabelas responsivas
- `Select`: Dropdowns e seletores
- `Input`: Campos de entrada
- `Tabs`: Navegação por abas
- `Badge`: Etiquetas e tags
- `Avatar`: Imagens de perfil
- `Tooltip`: Dicas contextuais
- `Dropdown Menu`: Menus suspensos
- `Sidebar`: Barra lateral
- `Drawer`: Painel deslizante
- `Skeleton`: Loading states
- `Toast`: Notificações (via Sonner)

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Linting do código
npm run lint

# Type checking
npm run type-check
```

## 🌐 Rotas da Aplicação

- `/` - Dashboard principal
- `/assets` - Análise de ativos
- `/markov-chains` - Regimes de Markov
- `/volatility` - Análise de volatilidade

## 📦 Dependências Principais

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.5",
  "tailwindcss": "^4.1.16",
  "recharts": "^2.15.4",
  "apexcharts": "^5.3.6",
  "react-grid-layout": "^1.5.2",
  "@radix-ui/react-*": "latest",
  "lucide-react": "^0.552.0",
  "zod": "^4.1.12"
}
>>>>>>> 7b1da332b56a078a5435fe904ba1eadbb2fab4c4
```

### Opção 2: Ambiente Local

#### 1. Pré-requisitos

- Node.js 20+ e npm instalados

#### 2. Instalar dependências

```bash
cd frontend
npm install
```

#### 3. Configurar variáveis de ambiente (opcional)

Crie um arquivo `.env` na pasta `frontend`:

```env
VITE_API_URL=http://localhost:8000
```

#### 4. Executar em modo desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:5173

#### 5. Build para produção

```bash
# Gerar build otimizado
npm run build

# Preview do build de produção
npm run preview
```

## 📱 Funcionalidades

### Dashboard Principal
- **Layout Personalizável**: Arraste e solte widgets para reorganizar
- **Persistência**: Layout salvo no localStorage
- **Cards Informativos**: Resumo de métricas principais
- **Gráficos de Resumo**: Visualizações rápidas de dados

### Análise de Ativos
- **Gráfico de Candlestick**: Visualização OHLC (Open, High, Low, Close)
- **Gráfico de Área Interativo**: Dados históricos com zoom e pan
- **Múltiplos Símbolos**: Suporte para diversos ativos financeiros
- **Intervalos de Tempo**: Seleção de granularidade (diário, semanal, mensal)

### Regimes de Markov
- **Visualização de Estados**: Identificação de regimes de mercado
- **Gráficos de Probabilidade**: Probabilidades de transição entre estados
- **Cores por Regime**: Diferenciação visual de estados de mercado
- **Análise Temporal**: Evolução dos regimes ao longo do tempo

### Volatilidade GARCH
- **Níveis de Volatilidade**: Visualização de diferentes níveis
- **Gráficos Interativos**: Zoom, pan e tooltips informativos
- **Modelos Configuráveis**: Suporte para GARCH, ARCH, EGARCH
- **Distribuições**: Normal, Student-t, Skewed-t

## 🎨 Componentes UI

O projeto utiliza uma biblioteca de componentes baseada em **Radix UI** e estilizada com **TailwindCSS**:

### Componentes Disponíveis
- `Button`: Botões com variantes e tamanhos
- `Card`: Containers para conteúdo
- `Chart`: Wrapper para gráficos
- `Table`: Tabelas responsivas
- `Select`: Dropdowns e seletores
- `Input`: Campos de entrada
- `Tabs`: Navegação por abas
- `Badge`: Etiquetas e tags
- `Avatar`: Imagens de perfil
- `Tooltip`: Dicas contextuais
- `Dropdown Menu`: Menus suspensos
- `Sidebar`: Barra lateral
- `Drawer`: Painel deslizante
- `Skeleton`: Loading states
- `Toast`: Notificações (via Sonner)

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Linting do código
npm run lint

# Type checking
npm run type-check
```

## 🎨 Personalização

### Adicionar Nova Página

1. Crie uma pasta em `src/pages/`:

```bash
mkdir src/pages/nova-pagina
touch src/pages/nova-pagina/index.tsx
```

2. Crie o componente:

```typescript
// src/pages/nova-pagina/index.tsx
export default function NovaPagina() {
  return (
    <div>
      <h1>Nova Página</h1>
    </div>
  );
}
```

3. Adicione a rota no `App.tsx` ou no arquivo de rotas

### Adicionar Novo Componente UI

Use a convenção shadcn/ui:

```bash
# Componentes são adicionados em src/components/ui/
# Siga o padrão dos componentes existentes
```

### Customizar Tema

Edite o arquivo `src/app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... outras variáveis */
  }
}
```

## 🔌 Integração com Backend

### Configuração da API

Configure a URL da API no arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Exemplo de Chamada API

```typescript
const fetchQuotations = async (symbol: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symbol: symbol,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      granularity: '1d',
    }),
  });
  
  return await response.json();
};
```

## 🌐 Rotas da Aplicação

- `/` - Dashboard principal
- `/assets` - Análise de ativos
- `/markov-chains` - Regimes de Markov
- `/volatility` - Análise de volatilidade

## 🧪 Desenvolvimento

### Estrutura de Componentes

Siga o padrão de organização:

```
components/
  feature-name/
    index.tsx          # Exportações principais
    FeatureMain.tsx    # Componente principal
    FeatureItem.tsx    # Sub-componente
```

### Convenções de Código

- Use TypeScript para type safety
- Componentes funcionais com hooks
- Props com interfaces TypeScript
- CSS com Tailwind classes
- Evite inline styles
- Use componentes UI da biblioteca

### Hot Module Replacement (HMR)

O Vite fornece HMR instantâneo. Suas mudanças aparecerão automaticamente no navegador sem refresh completo.

## 📦 Dependências Principais

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.5",
  "tailwindcss": "^4.1.16",
  "recharts": "^2.15.4",
  "apexcharts": "^5.3.6",
  "react-grid-layout": "^1.5.2",
  "@radix-ui/react-*": "latest",
  "lucide-react": "^0.552.0",
  "zod": "^4.1.12"
}
```

## 🐛 Troubleshooting

### Porta 5173 já em uso

```bash
# Altere a porta no vite.config.ts
export default defineConfig({
  server: {
    port: 3000,
  },
  // ...
})
```

### Erro de dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

### Problemas com TypeScript

```bash
# Verificar tipos
npm run type-check

# Limpar cache do TypeScript
rm -rf node_modules/.cache
```

### Erro de build

```bash
# Verificar configuração do Vite
# Verificar imports e exports
# Verificar se todos os arquivos TypeScript compilam
npm run build -- --debug
```

### Layout não salva

```bash
# Verificar localStorage no DevTools
# Limpar localStorage
localStorage.clear()
```

## 🎯 Boas Práticas

1. **Componentes Pequenos**: Mantenha componentes focados e reutilizáveis
2. **TypeScript**: Use types/interfaces para todas as props
3. **Performance**: Use React.memo e useMemo quando apropriado
4. **Acessibilidade**: Use componentes Radix UI que são acessíveis por padrão
5. **Responsividade**: Teste em diferentes tamanhos de tela
6. **Code Splitting**: Use lazy loading para rotas quando apropriado

## 📚 Documentação Adicional

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vitejs.dev
- **TailwindCSS**: https://tailwindcss.com
- **Radix UI**: https://www.radix-ui.com
- **Recharts**: https://recharts.org
- **ApexCharts**: https://apexcharts.com
- **React Router**: https://reactrouter.com

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### Opções de Deploy

- **Vercel**: Conecte seu repositório GitHub
- **Netlify**: Deploy automático via Git
- **Docker**: Use o Dockerfile incluído
- **Servidor Estático**: Sirva a pasta `dist/`

### Variáveis de Ambiente em Produção

Configure `VITE_API_URL` para apontar para sua API em produção.

## 📄 Licença

Consulte o arquivo LICENSE para mais informações.

---

**Interface moderna para análise financeira avançada** 📊✨
