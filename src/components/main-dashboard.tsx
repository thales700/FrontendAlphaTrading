"use client"

import { IconDragDrop2, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DashboardGrid from "@/components/dashboard-grid"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export function MainDashboard({ storageKey = "dashboard:grid:main", isEditable = true }: { storageKey?: string; isEditable?: boolean }) {
  return (
    <DashboardGrid
      storageKey={storageKey}
      isEditable={isEditable}
      items={[
        {
          id: "total-revenue",
          element: (
            <Card className="@container/card h-full overflow-hidden">
              <CardHeader className="min-h-11">
                <div className="flex items-center gap-2">
                  <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
                    <IconDragDrop2 />
                  </span>
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words">
                    $1,250.00
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingUp />
                      +12.5%
                    </Badge>
                  </CardAction>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Trending up this month <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Visitors for the last 6 months</div>
              </CardFooter>
            </Card>
          ),
        },
        {
          id: "new-customers",
          element: (
            <Card className="@container/card h-full overflow-hidden">
              <CardHeader className="min-h-11">
                <div className="flex items-center gap-2">
                  <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
                    <IconDragDrop2 />
                  </span>
                  <CardDescription>New Customers</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words">
                    1,234
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingDown />
                      -20%
                    </Badge>
                  </CardAction>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Down 20% this period <IconTrendingDown className="size-4" />
                </div>
                <div className="text-muted-foreground">Acquisition needs attention</div>
              </CardFooter>
            </Card>
          ),
        },
        {
          id: "active-accounts",
          element: (
            <Card className="@container/card h-full overflow-hidden">
              <CardHeader className="min-h-11">
                <div className="flex items-center gap-2">
                  <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
                    <IconDragDrop2 />
                  </span>
                  <CardDescription>Active Accounts</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words">
                    45,678
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingUp />
                      +12.5%
                    </Badge>
                  </CardAction>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Strong user retention <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Engagement exceed targets</div>
              </CardFooter>
            </Card>
          ),
        },
        {
          id: "growth-rate",
          element: (
            <Card className="@container/card h-full overflow-hidden">
              <CardHeader className="min-h-11">
                <div className="flex items-center gap-2">
                  <span className="drag-handle cursor-grab shrink-0 rounded text-muted-foreground inline-flex items-center" aria-label="Arraste para mover" title="Arraste para mover">
                    <IconDragDrop2 />
                  </span>
                  <CardDescription>Growth Rate</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl break-words">
                    4.5%
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <IconTrendingUp />
                      +4.5%
                    </Badge>
                  </CardAction>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Steady performance increase <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Meets growth projections</div>
              </CardFooter>
            </Card>
          ),
        },
        {
          id: "total-visitors",
          element: <ChartAreaInteractive />,
        },
      ]}
    />
  )
}


