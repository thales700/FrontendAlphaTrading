import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const [title, setTitle] = React.useState<string>("Dashboard")
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

    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>
      if (typeof custom.detail === "string" && custom.detail.length > 0) {
        setTitle(custom.detail)
      }
    }
    window.addEventListener("sidebar-menu-change", handler as EventListener)
    return () => {
      window.removeEventListener("sidebar-menu-change", handler as EventListener)
    }
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

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
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
        <h1 className="text-base font-medium text-foreground">{title}</h1>
        <div className="ml-auto flex items-center gap-2" />
      </div>
    </header>
  )
}
