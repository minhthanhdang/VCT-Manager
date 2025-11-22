import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AcsChart } from "../charts/acs-chart"
import { useState, useEffect } from "react";
import { GunChart } from "../charts/gun-chart";
import { getAgentCount, getAgentsKDRatio, getAgentsLineChartData, getMapsKDRatio, getMapsLineChartData, getMostPlayedMaps, getOffenseDefenseData } from "@/app/utils";
import { AgentCountChart } from "../charts/agent-count-chart";
import { AgentsLineChart } from "../charts/agents-line-chart";
import { AgentKDRChart } from "../charts/agent-kdr-chart";
import { MapsLineChart } from "../charts/maps-line-chart";
import { MapKDRChart } from "../charts/map-kdr-chart";
import { MapCountChart } from "../charts/map-count-chart";
import { OffenseDefenseChart } from "../charts/offense-defense-chart";
import { set } from "zod";

interface GeneralTabProps {
  records: any;
  profile: any;
}

export const GeneralTab = ({
  records,
  profile
}: GeneralTabProps) => {

  const [acs, setAcs] = useState<{ acs: number }[]>([]);
  const [gunStats, setGunStats] = useState<{ gun: string, kills: number, damage: number }[]>([]);
  const [pieChartData, setPieChartData] = useState<{ agent: string, played: number }[]>([])
  const [mapCountChartData, setMapCountChartData] = useState<{ map: string, played: number }[]>([])
  const [agentsLineChartData, setAgentsLineChartData] = useState<any[]>([])
  const [offenseDefenseChartData, setOffenseDefenseChartData] = useState<any[]>([])
  const [matchCount, setMatchCount] = useState<number>(0);
  const [agentKDR, setAgentKDR] = useState<{ agent: string, kdr: number }[]>([]);
  const [mapsLineChartData, setMapsLineChartData] = useState<any[]>([])
  const [mapKDR, setMapKDR] = useState<{ map: string, kdr: number }[]>([]);

  // Calculate ACS
  useEffect(() => {
    const tempAcs = [];
    if (records) {
      setMatchCount(records.length);
      
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        let acs = 0;
        if (!record.round_count || record.round_count === 0) {
          continue
        }
        acs = record.kda.combatScore/record.round_count;
        acs = parseFloat(acs.toFixed(2));
        tempAcs.push({ acs });
      }
      setAcs(tempAcs);

      const tempGunStats: any = {};
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        if (!record.gun_kills) {
          continue
        }
        const gunKills = record.gun_kills;
        for (const gun_name in gunKills) {
          if (!tempGunStats.hasOwnProperty(gun_name)) {
            tempGunStats[gun_name] = { gun: gun_name, kills: 0, damage: 0 };
          } else {
            tempGunStats[gun_name].kills += gunKills[gun_name];
          }
        }
      }
  
      let result: any[] = Object.values(tempGunStats)
      result = result.sort((a: any, b:any) => b.kills - a.kills)
      result = result.slice(0, 5)
      setGunStats(result);

      setPieChartData(getAgentCount(records));
      setAgentsLineChartData(getAgentsLineChartData(records));
      setAgentKDR(getAgentsKDRatio(records));
      setMapsLineChartData(getMapsLineChartData(records));
      setMapKDR(getMapsKDRatio(records));
      setMapCountChartData(getMostPlayedMaps(records));
      setOffenseDefenseChartData(getOffenseDefenseData(profile))
    }
    
  }, [records]);


  return (
    <Tabs defaultValue="general" className="w-full bg-black">
      <TabsList className="grid w-full grid-cols-3 bg-black text-red-500 gap-4">
        <TabsTrigger value="general">
          General
        </TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
        <TabsTrigger value="maps">Maps</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card className="rounded-none">
          <CardHeader className="py-4">
            <CardTitle className="text-[26px] leading-[28px]">General Statistics</CardTitle>
            <CardDescription>
              This player general statistics and match history
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-rows-2 grid-cols-2 gap-x-2 gap-y-2">
            <div className='col-span-2 row-span-1 font-bold'>
              <AcsChart chartData={acs}/>
            </div>
            <div className='col-span-2 row-span-1 font-bold'>
              <GunChart chartData={gunStats} matches={matchCount}/>
            </div>
            
            
            <div className="col-span-2 row-span-1 font-bold">
              <OffenseDefenseChart chartData={offenseDefenseChartData}/>
            </div>  
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="agents">
        <Card className="border-2 border-red-500 rounded-none">
          <CardHeader className="py-4">
            <CardTitle className="text-[26px] leading-[28px]">Agents Statistics</CardTitle>
            <CardDescription>
              This player's agents statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-rows-2 grid-cols-2 gap-2">
            <div className='col-span-2 row-span-1 font-bold'>
              <AgentsLineChart chartData={agentsLineChartData} />
            </div>
            <div className='col-span-2 row-span-1 font-bold'>
              <AgentKDRChart chartData={agentKDR}/>
            </div>
            <div className="col-span-1 row-span-1 font-bold">
              <AgentCountChart chartData={pieChartData}/>
            </div>  
            
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="maps">
        <Card className="border-2 border-red-500 rounded-none">
          <CardHeader className="py-4">
            <CardTitle className="text-[26px] leading-[28px]">Map Statistics</CardTitle>
            <CardDescription>
              This player general statistics and match history
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-rows-2 grid-cols-2 gap-2">
            <div className='col-span-2 row-span-1 font-bold'>
              <MapsLineChart chartData={mapsLineChartData}/>
            </div>
            <div className='col-span-2 row-span-1 font-bold'>
              <MapKDRChart chartData={mapKDR}/>
            </div>
            <div className="col-span-1 row-span-1 font-bold">
              <MapCountChart chartData={mapCountChartData}/>
            </div>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}