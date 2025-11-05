// Seu arquivo Home (ou layout.tsx) - Está CORRETO
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
 
export default function Home({ children }: { children: React.ReactNode }) {
  return (
    // 1. Gerencia o estado (aberto/fechado)
    <SidebarProvider> 
      
      {/* 2. A sua sidebar que você criou */}
      <AppSidebar /> 
      
      <main>
        {/* 3. O botão "hamburger" para abrir/fechar */}
        {/* <SidebarTrigger />  */}
        
        {/* O conteúdo da sua página */}
        {children} 
      </main>
    </SidebarProvider>
  )
}