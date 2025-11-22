import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Swords } from "lucide-react";
import { getBestAgents } from "@/app/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AgentCountChart } from "../app/(main)/main/(dashboard)/charts/agent-count-chart";
import { getAgentCount, getMostPlayedMaps } from "@/app/utils";
import { MapCountChart } from "../app/(main)/main/(dashboard)/charts/map-count-chart";
interface PlayerTooltipProps {
  profile: PlayerBase;
}

const roles: Record<string, { icon: string; bg: string }> = {
  Initiator: { icon: "/roles/initiator.png", bg: "initiator_bg.png" },
  Controller: { icon: "/roles/controller.png", bg: "controller_bg.png" },
  Duelist: { icon: "/roles/duelist.png", bg: "duelist_bg.png" },
  Sentinel: { icon: "/roles/sentinel.png", bg: "sentinel_bg.png" },
  Flex: { icon: "/roles/leader.svg", bg: "leader_bg.png" },
};

const PlayerTooltip = ({ profile }: PlayerTooltipProps) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [agentData, setAgentData] = useState<any[]>([]);
  const [mapData, setMapData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      if (!profile?.game_records) {
        return;
      }
      const data = await getBestAgents(profile?.game_records);
      setAgents(data);
    };
    const fetchAgentData = async () => {
      if (!profile?.game_records) {
        return;
      }
      const data = await getAgentCount(profile?.game_records);
      setAgentData(data);
    };
    const fetchMapData = async () => {
      if (!profile?.game_records) {
        return;
      }
      const data = await getMostPlayedMaps(profile?.game_records);
      setMapData(data);
    };

    fetchAgents();
    fetchAgentData();
    fetchMapData();
  }, [profile]);

  console.log(agents);
  console.log(profile);
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {roles?.[profile?.roles?.[0]] && (
            <div
              className="flex gap-3 bg-cover bg-no-repeat bg-center p-2 shadow-md  hover:scale-110 rounded-lg"
              style={{
                backgroundImage:
                  profile?.roles?.[profile?.roles?.length - 1] == "Flex"
                    ? `url(${
                        roles?.[profile?.roles?.[profile?.roles?.length - 1]]
                          ?.bg
                      })`
                    : `url(${roles?.[profile?.roles?.[0]]?.bg})`,
                order:
                  profile?.roles?.[profile?.roles?.length - 1] == "Flex"
                    ? -1
                    : 0,
              }}
            >
              <img
                src={
                  profile?.roles?.[profile?.roles?.length - 1] == "Flex"
                    ? roles?.[profile?.roles?.[profile?.roles?.length - 1]].icon
                    : roles?.[profile?.roles?.[0]].icon
                }
                className="w-6 h-6"
              />
              {profile?.["in_game_name"]}
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent side="left" className="shadow-md">
          <div className="text-black w-[300px] relative flex flex-col text-[14px] py-2 px-2 gap-2 ">
            <div className="flex gap-2 items-center">
              <img src="PlaceholderAvatar.png" className="w-12 h-12" />
              <div className="flex flex-col">
                <div>
                  {profile?.["in_game_name"]} ({profile?.["first_name"]}{" "}
                  {profile?.["last_name"]})
                </div>
                <div>
                  {profile?.["current_team_acronym"]} -{" "}
                  {profile?.["current_team_name"]}
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-center justify-center">
              <Swords />
              {agents?.map((agent, index) => (
                <Avatar key={index}>
                  <AvatarImage
                    src={
                      agent == "KAY/O"
                        ? "/agents/Kay-o.png"
                        : `/agents/${agent}.png`
                    }
                  />
                  <AvatarFallback>{agent}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex gap-2 w-full !text-[12px]">
              <AgentCountChart chartData={agentData} />
              <MapCountChart chartData={mapData} />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PlayerTooltip;
