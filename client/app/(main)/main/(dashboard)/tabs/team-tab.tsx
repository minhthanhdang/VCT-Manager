"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { SuggestTeamCard } from "../other/suggest-team-card";
import { getSuggestMapAgents } from "@/app/utils";
import { GenerateAttackCard } from "../other/generate-attack-card";
import { cn } from "@/lib/utils";
import { GenerateDefenseCard } from "../other/generate-defense-card";
import MapGallery from "../../(individuals)/_components/map-gallery";
import { maps } from "@/constants/maps";
import useMapGalleryStore from "@/stores/use-map-gallery-store";

interface TeamTabProps {
  profiles: any[];
  sessionId: string;
}

export const TeamTab = ({ profiles, sessionId }: TeamTabProps) => {
  const { selected, setSelected } = useMapGalleryStore();
  const [selectedMap, setSelectedMap] = useState(maps[selected]);
  const [suggestedAgents, setSuggestedAgents] = useState<any>(null);

  useEffect(() => {
    setSelectedMap(maps[selected]);
  }, [selected]);

  useEffect(() => {
    setSuggestedAgents(getSuggestMapAgents(profiles));
  }, [profiles]);

  return (
    <div className="relative w-full h-full flex flex-col gap-14 overflow-scroll-y py-4 px-12 max-w-[1080px]">
      <h1 className="w-full font-bold text-[26px] text-center border-b-2 border-accent leading-[55px]">
        Team Composition
      </h1>
      <div className="flex w-full h-[24px] justify-start items-center gap-3">
        <div className="font-bold">Current Map: {selectedMap.name}</div>
      </div>
      <div>
        <MapGallery />
      </div>
      <div className="relative w-full">
        <SuggestTeamCard
          map={selectedMap.name}
          suggestedAgents={["KAY/O", "Jett", "Astra", "Killjoy", "Sage"]}
        />
      </div>
      <div className="relative h-full w-full overflow-scroll-y mb-10">
        {maps.map((map, index) => {
          return (
            <div
              className={cn(
                "relative w-full h-full max-h-[275px]",
                selectedMap === map ? "block" : "hidden"
              )}
            >
              <GenerateAttackCard
                key={index}
                players={profiles?.map(
                  (profile) =>
                    profile["first_name"] ||
                    "" + " " + profile["last_name"] ||
                    ""
                )}
                agents={
                  suggestedAgents && map && map.name in suggestedAgents
                    ? suggestedAgents[map.name]
                    : []
                }
                map={map.name}
                sessionId={sessionId}
              />
            </div>
          );
        })}
        {maps.map((map, index) => {
          return (
            <div
              className={cn(
                "relative w-full h-full max-h-[275px] mt-2",
                selectedMap === map ? "block" : "hidden"
              )}
            >
              <GenerateDefenseCard
                key={index}
                players={profiles?.map(
                  (profile) =>
                    profile["first_name"] ||
                    "" + " " + profile["last_name"] ||
                    ""
                )}
                agents={
                  suggestedAgents && map && map.name in suggestedAgents
                    ? suggestedAgents[map.name]
                    : []
                }
                map={map.name}
                sessionId={sessionId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
