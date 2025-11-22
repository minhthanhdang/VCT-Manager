"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useEffect } from "react"
import { useState } from "react"
import { set } from "zod"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

export const description = "A radar chart with multiple data"


const chartConfig = {
  offense: {
    label: "Offense",
    color: "hsl(var(--chart-1))",
  },
  defense: {
    label: "Defense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface OffenseDefenseChartProps {
  chartData: any[]
}

export function OffenseDefenseChart({
  chartData
}: OffenseDefenseChartProps) {
  console.log("CHART DATA: ", chartData)  

  const [normalizedData, setNormalizedData] = useState<any[]>([])
  useEffect(() => {
    
    if (chartData.length === 0) {
      return;
    }
    const globalMax = Math.max(
      ...chartData.flatMap(d => [d.offense, d.defense])
    );
    
    // Step 2: Scale each object's offense and defense values
    const scaledData = chartData.map(d => {
      const objectMax = Math.max(d.offense, d.defense);
      const scale = globalMax / objectMax;
      
      return {
        data: d.data,
        offense: d.offense * scale,
        defense: d.defense * scale,
      };
    });
    setNormalizedData(scaledData);

  }, [chartData])
  console.log(normalizedData)
  return (
    <Card className="relative w-full h-full">
      <CardHeader className="items-center pb-4">
        <CardTitle>Offense vs Defense stats</CardTitle>
      </CardHeader>
      <CardContent className="relative w-full h-full pb-16 px-16]">
        <ChartContainer
          config={chartConfig}
          className="relative w-full h-full"
        >
            <RadarChart data={normalizedData}>
              <ChartTooltip
                cursor={false}
                payload={chartData}
                content={<ChartTooltipContent 
                  indicator="line" 
                  formatter={(value: ValueType, name: NameType, item, index: number, payload) => {
                    console.log("index: ", index)
                    console.log("item: ", item)
                    console.log("value: ", value)
                    console.log("payload: ", payload)
                    return (
                      <>
                      <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                      style={
                        {
                          "--color-bg": `var(--color-${name})`,
                        } as React.CSSProperties}
                      >
                        
                      </div>
                      <div>
                      {chartData[normalizedData.findIndex(p => p==payload)][name]}
                      </div>
                      </>
                    )
                  }}
                />}
              />
              <PolarAngleAxis dataKey="data" />
              <PolarGrid />
              <Radar
                dataKey="offense"
                fill="var(--color-offense)"
                fillOpacity={0}
                stroke="var(--color-offense)"
                strokeWidth={6}
              />
              <Radar 
                dataKey="defense" 
                fill="var(--color-defense)" 
                fillOpacity={0}
                stroke="var(--color-defense)"
                strokeWidth={6}/>
              <ChartLegend content={<ChartLegendContent />}/>
            </RadarChart>
            
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
