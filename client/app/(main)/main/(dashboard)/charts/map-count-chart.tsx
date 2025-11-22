"use client";

import { useState, useEffect } from "react";
import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MapCountChartProps {
  chartData: { map: string; played: number }[];
}

export const MapCountChart = ({ chartData }: MapCountChartProps) => {
  const [pieChartData, setPieChartData] = useState<
    { map: string; played: number }[]
  >([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    played: {
      label: "Played",
    },
  });

  useEffect(() => {
    const tempPieChartData: { map: string; played: number; fill: string }[] =
      [];
    const temp: ChartConfig = {
      played: {
        label: "Played",
      },
    };

    for (let i = 0; i < chartData.length; i++) {
      temp[chartData[i].map] = {
        label: chartData[i].map,
        color: `hsl(var(--chart-${i + 1}))`,
      };

      tempPieChartData.push({
        map: chartData[i].map,
        played: chartData[i].played,
        fill: `hsl(var(--chart-${i + 1}))`,
      });
    }

    setPieChartData(tempPieChartData);
    setChartConfig(temp);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most played Maps</CardTitle>
        <CardDescription className="!text-[11px] leading-none">
          January - July 2024
        </CardDescription>
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
                dataKey="map"
                className="fill-background text-foreground"
                stroke="none"
                fontSize={9}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-[11px] leading-none text-muted-foreground">
          Showing game played for the last 7 months
        </div>
      </CardFooter>
    </Card>
  );
};
