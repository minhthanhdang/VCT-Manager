
import { TrendingUp } from "lucide-react"

import { CartesianGrid, Line, LineChart, YAxis } from "recharts"
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

const chartConfig = {
  desktop: {
    label: "Average Combat Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


interface AcsChartProps {
  chartData: { acs: number }[]
}
export const AcsChart = ({
  chartData,
}: AcsChartProps) => {

  return (
    <Card className="font-bold">
      <CardHeader>
        <CardTitle>Average Combat Score</CardTitle>
        <CardDescription>All matches in 2024</CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-1 pt-0">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 14,
              left: 0,
              right: 12,
              bottom: 14,
            }}
          >
            
            <YAxis
              dataKey="acs"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickCount={5}
              interval={0}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="acs"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            >
             
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-bold leading-none">
          Average ACS: {(chartData.reduce((acc, item) => acc + item.acs, 0)/chartData.length).toFixed(2)}  <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )

}