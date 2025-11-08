import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout"
import { AssetsPage } from "@/pages/assets"
import { MarkovChainsPage } from "@/pages/markov-chains"
import { VolatilityPage } from "@/pages/volatility"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard está sempre montado no Layout, então não precisa de rota específica */}
          <Route index element={null} />
          <Route path="dashboard" element={null} />
          
          {/* Outras páginas - renderizadas apenas quando acessadas */}
          <Route path="assets" element={
            <div className="px-4 lg:px-6">
              <AssetsPage />
            </div>
          } />
          <Route path="markov-chains" element={
            <div className="px-4 lg:px-6">
              <MarkovChainsPage />
            </div>
          } />
          <Route path="volatility" element={
            <div className="px-4 lg:px-6">
              <VolatilityPage />
            </div>
          } />
          <Route path="*" element={
            <div className="px-4 lg:px-6">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
                <h2 className="text-2xl font-bold">Página não encontrada</h2>
                <p className="text-muted-foreground">A página que você está procurando não existe.</p>
              </div>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
