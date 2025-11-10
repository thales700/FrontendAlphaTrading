import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface SiteHeaderProps {
  title?: string
  description?: string
}

export function SiteHeader({ title, description }: SiteHeaderProps) {
  const [isDark, setIsDark] = React.useState<boolean>(false)

  React.useEffect(() => {
    // initialize theme from localStorage or prefers-color-scheme
    try {
      const saved = localStorage.getItem("theme")
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      const shouldUseDark = saved ? saved === "dark" : prefersDark
      if (shouldUseDark) {
        document.documentElement.classList.add("dark")
        setIsDark(true)
      } else {
        document.documentElement.classList.remove("dark")
        setIsDark(false)
      }
    } catch {}
  }, [])

  const toggleTheme = () => {
    try {
      const next = !isDark
      setIsDark(next)
      if (next) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
    } catch {}
  }

  // Se tem descrição, usa um header maior
  const hasDescription = Boolean(description)

  return (
    <header className={`flex shrink-0 gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) max-w-full overflow-x-hidden ${
      hasDescription ? 'h-auto py-4' : 'h-(--header-height) items-center'
    }`}>
      <div className={`flex w-full gap-1 px-4 lg:gap-2 lg:px-6 max-w-full overflow-x-hidden ${hasDescription ? 'flex-col' : 'items-center'}`}>
        <div className="flex items-center gap-1 lg:gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="-ml-1 text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {isDark ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
          </Button>
          <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          {!hasDescription && (
            <h1 className="text-sm sm:text-base font-medium text-foreground truncate">{title || "Dashboard"}</h1>
          )}
          {!hasDescription && <div className="ml-auto flex items-center gap-2" />}
        </div>
        
        {hasDescription && (
          <div className="flex flex-col gap-1 mt-2 max-w-full">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">{title}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground break-words">{description}</p>
          </div>
        )}
      </div>
    </header>
  )
}
