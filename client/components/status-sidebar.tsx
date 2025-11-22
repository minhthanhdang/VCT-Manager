import { useState, useEffect } from "react";
import useStatusSidebarStore from "@/stores/use-status-sidebar";
import { cn } from "@/lib/utils";
import { RocketIcon } from "@radix-ui/react-icons";
import PlayerTooltip from "./player-tooltip";
import { Card } from "@/components/ui/card";

const StatusSidebar = () => {
  const [players, setPlayers] = useState<any[]>([
    "108695555965222493",
    "112648615953243285",
    "106652145373704062",
    "111878437775806356",
    "108695564980340715",
  ]);
  const [profiles, setProfiles] = useState<any[]>([]);

  const { isOpen,teams, addTeam } = useStatusSidebarStore();

  // Load static profiles if receive new IDs
  useEffect(() => {
    const fetchPlayers = async (player_files: string[]) => {
      if (!player_files || player_files.length === 0) {
        setProfiles([]);
        return;
      }
      const temp_profiles = [];

      for (let i = 0; i < player_files.length; i++) {
        try {
          const file_path = "/profiles/" + player_files[i] + ".json";
          const response = await fetch(file_path);
          const data = await response.json();
          temp_profiles.push(data);
          console.log(data);
        } catch (error) {
          console.error("Error loading JSON:", error);
        }
      }
      setProfiles(temp_profiles);
    };

    fetchPlayers(players);
  }, [players]);

  console.log(profiles);
  return (
    <div
      className={cn(
        "w-[256px] h-full bg-sidebar border-l-[1px] border-l-muted shadow-md",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col h-full px-4 py-6">
        <div className="flex gap-2 items-center justify-center p-4">
          <RocketIcon className="text-accent font-bold h-8 w-8" />
          <h2 className="text-[24px] text-accent font-bold">Team Builder</h2>
        </div>

        <Card className="p-4 flex flex-col gap-2">
          {profiles.map((profile) => (
            <PlayerTooltip key={profile.id} profile={profile} />
          ))}
        </Card>
      </div>
    </div>
  );
};

export default StatusSidebar;
