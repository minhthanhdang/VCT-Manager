"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
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
import { useState, useEffect } from "react"

interface AgentKDRChartProps {
  chartData: any[]
}

export const AgentKDRChart = ({
  chartData
}: AgentKDRChartProps) => {
  console.log(chartData)

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    kdr: {
      label: "K/D Ratio",
    },
  })

  const [barChartData, setBarChartData] = useState<{ agent: string, kdr: number }[]>([]);

  useEffect(() => {
    let temp: ChartConfig = {
      kdr: {
        label: "K/D Ratio",
      },
    } satisfies ChartConfig;

    let tempBarChartData: { agent: string, kdr: number, fill:string }[] = [];

    for (let i = 0; i < chartData.length; i++) {
      let agent = chartData[i].agent;
      temp[agent] = {
        label: agent,
        color: `hsl(var(--chart-${i + 1}))`,
      }

      tempBarChartData.push({
        agent: agent,
        kdr: chartData[i].kdr,
        fill: `hsl(var(--chart-${i + 1}))`
      })
    }

    setChartConfig(temp);
    setBarChartData(tempBarChartData);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>K/D Ratios</CardTitle>
        <CardDescription>Recent matches</CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-1 pt-0 pb-4 ps-5">
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart
            accessibilityLayer
            data={barChartData}
            layout="vertical"
            margin={{
              left: 10,
              bottom: 10
            }}
          >
            <YAxis
              dataKey="agent"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
             
            />
            <XAxis dataKey="kdr" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="kdr" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}