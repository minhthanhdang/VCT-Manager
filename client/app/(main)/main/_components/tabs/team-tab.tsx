"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react"
import { SuggestTeamCard } from "../other/suggest-team-card"
import { getSuggestMapAgents } from "@/app/utils"
import { GenerateAttackCard } from "../other/generate-attack-card"
import { cn } from "@/lib/utils"
import { GenerateDefenseCard } from "../other/generate-defense-card"

interface TeamTabProps {
  profiles: any[],
  sessionId: string
}

export const TeamTab = ({
  profiles,
  sessionId
}: TeamTabProps) => {

  const MAP = ["Abyss", "Ascent", "Bind", "Haven", "Pearl", "Split", "Sunset"]
  const [selectedMap, setSelectedMap] = useState(MAP[0])
  const [suggestedAgents, setSuggestedAgents] = useState<any>(null)

  useEffect(() => {
    setSuggestedAgents(getSuggestMapAgents(profiles))
  }, [profiles])

  return (
    <div className="relative w-full h-full flex flex-col gap-2 overflow-scroll-y">
      <div className="w-full font-bold h-[24px] text-[22px] text-center">
        The suggested team composition:
      </div>
      <div className="flex w-full h-[24px] justify-end items-center gap-3">
        <div className="font-bold">Selected Map: </div>
        <Select defaultValue={MAP[0]} onValueChange={(value)=>{setSelectedMap(value)}}>
          <SelectTrigger className="w-[180px] bg-accent text-black font-bold">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent className="font-bold">
            {
              MAP.map((map, index) => {
                return (
                  <SelectItem key={index} value={map} className="font-bold">
                    {map}
                  </SelectItem>
                )
              })
            }
          </SelectContent>
        </Select>
      </div>
      <div className="relative w-full">
        <SuggestTeamCard map={selectedMap} suggestedAgents={suggestedAgents}/>
      </div>
      <div className="relative h-full w-full overflow-scroll-y mb-10">
        {
          MAP.map((map, index) => {
            return (
              <div className={cn(
                "relative w-full h-full max-h-[275px]",
                selectedMap === map ? "block" : "hidden"
              )}>
              <GenerateAttackCard 
                key={index}
                players={profiles?.map((profile) => profile["first_name"] || "" + " " + profile["last_name"] || "")} 
                agents={suggestedAgents && map && map in suggestedAgents
                  ? suggestedAgents[map]
                  : []
                }
                map={map}
                sessionId={sessionId}
              />
              </div>
            )
          })
        }
        {
          MAP.map((map, index) => {
            return (
              <div className={cn(
                "relative w-full h-full max-h-[275px] mt-2",
                selectedMap === map ? "block" : "hidden"
              )}>
              <GenerateDefenseCard 
                key={index}
                players={profiles?.map((profile) => profile["first_name"] || "" + " " + profile["last_name"] || "")} 
                agents={suggestedAgents && map && map in suggestedAgents
                  ? suggestedAgents[map]
                  : []
                }
                map={map}
                sessionId={sessionId}
              />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}