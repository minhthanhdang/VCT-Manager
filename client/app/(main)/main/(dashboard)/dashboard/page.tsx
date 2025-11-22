"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoProfile } from "../other/no-profile";
import { TeamTab } from "../tabs/team-tab";
import { IndividualTab } from "../tabs/individuals-tab";
interface DashboardProps {
  players: any;
  sessionId: string;
}
const Dashboard = ({ sessionId }: DashboardProps) => {
  const [players, serPlayers] = useState<string[]>(["106116564871354330"]);
  const [profiles, setProfiles] = useState<any[]>([]);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <TeamTab profiles={profiles} sessionId={sessionId} />
    </div>
  );
};

export default Dashboard;
