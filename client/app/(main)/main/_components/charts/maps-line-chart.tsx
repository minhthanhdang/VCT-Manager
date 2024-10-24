
"use client"

import { useState, useEffect } from "react"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { set } from "zod"

interface MapsLineChartProps {
  chartData: any[]
}

export const MapsLineChart = ({
  chartData
}: MapsLineChartProps) => {

  const [chartConfig, setChartConfig] = useState<ChartConfig>({})
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {

    let temp: ChartConfig = {}
    let example = chartData[0]
    let labels = Object.keys(example)
    labels = labels.filter((label) => label !== 'dataPoint')

    

    for (let i = 0; i < labels.length; i++) {
      temp[labels[i]] = {
        label: labels[i],
        color: `hsl(var(--chart-${i + 1}))`,
      }
    }

    setChartConfig(temp)
    setLabels(labels)
  }, [chartData])

  console.log(chartData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player's Average Combat Score On Different Maps</CardTitle>
        <CardDescription>Maps performance in last 6 appearances</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dataPoint"
              hide={true}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            {labels.map((data, index) => (
              <Line
                key={index}
                dataKey={data}
                type="monotone"
                stroke={`hsl(var(--chart-${index + 1}))`}
                strokeWidth={2}
                dot={false}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />}/>
          </LineChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}