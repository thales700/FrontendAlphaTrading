import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const [title, setTitle] = React.useState<string>("Dashboard")

  React.useEffect(() => {
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

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2" />
      </div>
    </header>
  )
}
