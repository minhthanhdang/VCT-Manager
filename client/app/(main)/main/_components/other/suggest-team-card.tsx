"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SuggestTeamCardProps {
  map: string,
  suggestedAgents: any
}

export const SuggestTeamCard = ({
  map,
  suggestedAgents
}: SuggestTeamCardProps) => {
  
  console.log("suggestedAgents", suggestedAgents);
  return (
    <Card className="relative w-full">
      <CardHeader>
        <CardTitle className="text-[20px] leading-3">Suggested Team for {map}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-medium">
          We suggest the following agents for the map {map}:
        </div>
        <div className="flex gap-4 mt-2 py-2 px-4 bg-secondary rounded-2xl items-center">
        {map && suggestedAgents && suggestedAgents[map]
          ? suggestedAgents[map].map((agent: string, index:number) => {
            return (
              <Avatar key={index}>
                <AvatarImage src={
                  agent == "KAY/O" ? '/agents/Kay-o.png' : `/agents/${agent}.png`
                } />
                <AvatarFallback>{agent}</AvatarFallback>
              </Avatar>
            )
          })
          : null
        }
        </div>
      </CardContent>
    </Card>
  )
}