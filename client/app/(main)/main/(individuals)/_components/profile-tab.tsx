"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GeneralTab } from "../../(dashboard)/tabs/general-tab";
import { getBestAgents, getBestMaps } from "@/app/utils";
import { useEffect, useState } from "react";

interface ProfileTabProps {
  profile: any;
}

export const ProfileTab = ({ profile }: ProfileTabProps) => {
  const [bestAgents, setBestAgents] = useState<string[]>([]);
  const [bestMaps, setBestMaps] = useState<string[]>([]);

  console.log("profile", profile);
  useEffect(() => {
    let tempBestAgents = getBestAgents(profile.game_records);
    let tempBestMaps = getBestMaps(profile.game_records);

    setBestAgents(tempBestAgents);
    setBestMaps(tempBestMaps);
  }, [profile]);

  return (
    <div className="relative flex w-full h-full bg-black overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <div className="relative h-full w-full grid grid-rows-10 gap-2 row-">
        <div className="relative row-span-3 bg-[#ff4655] px-10 flex items-center">
          <div className="h-full grid grid-cols-12 ">
            <div className="col-span-3 flex items-center">
              <Image
                src="/PlaceholderAvatar.png"
                alt="Avatar"
                width={180}
                height={180}
                className="aspect-square"
              />
            </div>

            <div className="col-span-9 flex flex-col ps-10 text-black justify-center">
              <div className="text-[24px] font-bold uppercase leading-5">
                {profile.first_name} {profile.last_name}
              </div>
              <div className="text-[18px] font-semibold">
                {profile.current_team_name} ({profile.current_team_acronym}) -{" "}
                {profile.current_league_name}
              </div>
              <div className="flex mt-2 gap-3 py-2 px-4 bg-secondary rounded-2xl items-center">
                <div className="font-bold mr-2">Best agents: </div>
                {bestAgents.map((agent, index) => {
                  return (
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
                  );
                })}
              </div>
              <div className="flex mt-2 gap-3 py-2 px-4 bg-secondary rounded-2xl items-center">
                <div className="font-bold mr-2">Best maps: </div>
                {bestMaps.map((map, index) => {
                  return (
                    <Avatar key={index}>
                      <AvatarImage src={`/maps/${map}.png`} />
                      <AvatarFallback>{map}</AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col w-full h-full row-span-7">
          <GeneralTab records={profile.game_records} profile={profile} />
        </div>
      </div>
    </div>
  );
};
