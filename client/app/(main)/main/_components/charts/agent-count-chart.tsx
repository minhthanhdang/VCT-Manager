"use client"

import { useState, useEffect } from "react"
import { LabelList, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface AgentCountChartProps {
  chartData: { agent: string, played: number }[]
}

export const AgentCountChart = ({
  chartData
}: AgentCountChartProps) => {

  const [pieChartData, setPieChartData] = useState<{ agent: string, played: number }[]>([])
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    played: {
      label: "Played",
    }
  })

  useEffect(() => {

    const tempPieChartData: { agent: string, played: number, fill: string }[] = [];
    const temp: ChartConfig = {
      played: {
        label: "Played",
      }
    }

    for (let i = 0; i < chartData.length; i++) {
      temp[chartData[i].agent] = {
        label: chartData[i].agent,
        color: `hsl(var(--chart-${i + 1}))`,
      }

      tempPieChartData.push({
        agent: chartData[i].agent,
        played: chartData[i].played,
        fill: `hsl(var(--chart-${i + 1}))`
      })
    }

    setPieChartData(tempPieChartData)
    setChartConfig(temp)
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most played Agents</CardTitle>
        <CardDescription>January - July 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="played" hideLabel />}
            />
            <Pie data={pieChartData} dataKey="played">
              <LabelList
                dataKey="agent"
                className="fill-background"
                stroke="none"
                fontSize={14}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing game played for the last 7 months
        </div>
      </CardFooter>
    </Card>
  )
}