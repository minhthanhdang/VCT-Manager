"use client"

import { useEffect, useState } from "react";
import { ProfileTab } from "./tabs/profile-tab";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { NoProfile } from "./other/no-profile";
import { TeamTab } from "./tabs/team-tab";
import { IndividualTab } from "./tabs/individuals-tab";

interface DashboardProps {
  players: any;
  sessionId: string;
}

export const Dashboard = ({
  players,
  sessionId
}: DashboardProps) => {

  const [profiles, setProfiles] = useState<any[]>([]);

  // Load static profiles if receive new IDs
  useEffect(() => {
    const fetchPlayers = async (player_files: string) => {

      if (!player_files || player_files.length === 0) {
        setProfiles([]);
        return;
      }
      const temp_profiles = [];
      
        
      for (let i = 0; i < player_files.length; i++) {
        try {
          const file_path = "/profiles/" + player_files[i] + ".json";
          const response = await fetch(file_path)
          const data = await response.json();
          temp_profiles.push(data);
          console.log(data);
        } catch (error) {
          console.error('Error loading JSON:', error);
        }
      }
        setProfiles(temp_profiles);
    }

    fetchPlayers(players);
  }, [players]);
  
  console.log(players)
  console.log("Profiles: ", profiles);
  if (profiles && profiles.length > 0) {
    return (
      <Tabs className="relative w-full h-full overflow-hidden" defaultValue="team">
        <TabsList className="relative flex w-full gap-2 overflow-hidden bg-black">

          <TabsTrigger value="team" className="overflow-hidden flex-grow">
            Team Composition
          </TabsTrigger>
          <TabsTrigger value="individuals" className="overflow-hidden flex-grow">
            Individual Profiles
          </TabsTrigger>
        </TabsList>
        <TabsContent value="team" className="relative w-full h-full overflow-hidden">
          <TeamTab profiles={profiles} sessionId={sessionId}/>
        </TabsContent>
        <TabsContent value="individuals" className="relative w-full h-full overflow-hidden">
          <IndividualTab profiles={profiles} />
        </TabsContent>  
      </Tabs>
    )
  } else {
    // Placeholder for no profiles
    console.log("No profiles");
    return (
      <NoProfile />
    )
  }
  
}