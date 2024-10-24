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

interface DashboardProps {
  players: any;
}

export const Dashboard = ({
  players
}: DashboardProps) => {

  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayers = async (player_files: string) => {

      if (!player_files || player_files.length === 0) {
        setProfiles([]);
        return;
      }

      try {
        const temp_profiles = [];
        for (let i = 0; i < player_files.length; i++) {
          const file_path = "/profiles/" + player_files[i] + ".json";
          const response = await fetch(file_path)
          const data = await response.json();
          temp_profiles.push(data);
          console.log(data);
        }
        setProfiles( temp_profiles);
      } catch (error) {
        console.error('Error loading JSON:', error);
      }
    }

    fetchPlayers(players);
  }, [players]);
  
  if (profiles && profiles.length > 0) {
    return (
      <Tabs defaultValue={profiles[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-5 overflow-hidden bg-black">
          {profiles.map((profile: any) => (
            <TabsTrigger value={profile.id} key={profile.id} className="overflow-hidden ">
            
              {profile.first_name} {profile.last_name}
             
            </TabsTrigger>
          ))}
        </TabsList>

        {profiles.map((profile: any) => (
          <TabsContent value={profile.id} key={profile.id} className="relative w-full h-full">
            <ProfileTab profile={profile} />
          </TabsContent>
        ))}

      </Tabs>
    )
  } else {
    console.log("No profiles");
    return (
      <NoProfile />
    )
  }
  
}