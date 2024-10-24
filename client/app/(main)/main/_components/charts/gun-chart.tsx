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

interface GunChartProps {
  chartData: { gun: string, kills: number, damage: number }[],
  matches: number
}

export const GunChart = ({
  chartData,
  matches
}: GunChartProps) => {


  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    kills: {
      label: "kills",
    },
  })

  const [barChartData, setBarChartData] = useState<{ gun: string, kills: number, fill: string }[]>([]);

  useEffect(() => {
    const temp: ChartConfig = {
      kills: {
        label: "kills",
      },
    } satisfies ChartConfig;

    const tempBarChartData: { gun: string, kills: number, fill: string }[] = [];

    for (let i = 0; i < chartData.length; i++) {
      const gun = chartData[i].gun;
      temp[gun] = {
        label: gun,
        color: `hsl(var(--chart-${i + 1}))`,
      }

      tempBarChartData.push({
        gun: gun,
        kills: chartData[i].kills,
        fill: `hsl(var(--chart-${i + 1}))`
      })
    }

    setChartConfig(temp);
    setBarChartData(tempBarChartData);
  }, [chartData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Gun Kills</CardTitle>
        <CardDescription>Recent matches</CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-1 pt-0 ps-5">
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart
            accessibilityLayer
            data={barChartData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <YAxis
              dataKey="gun"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
             
            />
            <XAxis dataKey="kills" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="kills" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-bold leading-none">
          Total of last {matches} matches
        </div>
      </CardFooter>
    </Card>
  )
}