"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { toast } from "sonner"


interface GenerateDefenseCardProps {
  players: string[],
  agents: string[],
  map: string,
  sessionId: string
}

export const GenerateDefenseCard = ({
  players,
  agents,
  map,
  sessionId
}: GenerateDefenseCardProps) => {

  const [strategy, setStrategy] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = async (map: string, agents: string[], players: string[]) => {
    if (agents.length === 0 || players.length === 0) {
      toast("error", {
        description: "Please select agents and players"
      })
      console.log("No agents or players")
      return
    }
    try {
      setIsLoading(true)
      let prompt = "Generate a strategy for defending on map " + map + " with the following agents: " + agents.join(", ") + " played by players: " + players.join(", ") + " respectively."
      console.log(prompt)
      const response = await axios.post("/api/invokeAgent", {
        prompt: prompt,
        sessionId: sessionId,
        ids: []
      })
      if ("error" in response.data) {
        console.log(response.data.error);
        toast("error", {
          description: response.data.error
        })
        return;
      } else {
        setStrategy(response.data.completion)
        console.log(response.data.completion)
      }
    } catch (err) {
      console.log("Error generating")
    } finally {
      setIsLoading(false)
    }
  }
  console.log(strategy)
  return (
    <Card className="relative w-full h-full max-h-[300px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pb-10">
      <CardHeader>
        <CardTitle className="text-[22px] leading-4">Defense strategy recommendation</CardTitle>
        <CardDescription>Generate a strategy here!</CardDescription>
      </CardHeader>
      <CardContent className="relative w-full h-full flex flex-col gap-2">
        {strategy!= "" && (
          <div className="w-full text-[18px] font-medium whitespace-pre-line">
            {strategy}
          </div>
        )}
        <Button 
          className="bg-accent hover:bg-secondary hover:text-black w-full"
          onClick={(e:any)=>onSubmit(map, agents, players)}
          disabled={isLoading}
        >
            Generate New Strategy
        </Button>
      </CardContent>
    </Card>
  )
}