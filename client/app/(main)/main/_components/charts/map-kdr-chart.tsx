"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
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

interface MapKDRChartProps {
  chartData: any[]
}

export const MapKDRChart = ({
  chartData
}: MapKDRChartProps) => {
  console.log(chartData)

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    kdr: {
      label: "K/D Ratio",
    },
  })

  const [barChartData, setBarChartData] = useState<{ map: string, kdr: number }[]>([]);

  useEffect(() => {
    const temp: ChartConfig = {
      kdr: {
        label: "K/D Ratio",
      },
    } satisfies ChartConfig;

    const tempBarChartData: { map: string, kdr: number, fill:string }[] = [];

    for (let i = 0; i < chartData.length; i++) {
      const map = chartData[i].map;
      temp[map] = {
        label: map,
        color: `hsl(var(--chart-${i + 1}))`,
      }

      tempBarChartData.push({
        map: map,
        kdr: chartData[i].kdr,
        fill: `hsl(var(--chart-${i + 1}))`
      })
    }

    setChartConfig(temp);
    setBarChartData(tempBarChartData);
  }, [chartData]);

  return (
    <Card className="relative w-full">
      <CardHeader>
        <CardTitle>K/D Ratios</CardTitle>
        <CardDescription>Recent matches</CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-1 pt-0 pb-4 ps-5 w-full">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
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
              dataKey="map"
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