"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VerticalAgentImage from "../_components/vertical-agent-image";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface SuggestTeamCardProps {
  map: string;
  suggestedAgents: any;
}

export const SuggestTeamCard = ({
  map,
  suggestedAgents = ["KAY/O", "Jett", "Astra", "Killjoy", "Sage"],
}: SuggestTeamCardProps) => {
  console.log(suggestedAgents);
  return (
    <Card className="relative w-full">
      <CardHeader>
        <CardTitle className="text-[20px] leading-3 flex gap-2 items-center">
          <StarFilledIcon className="w-6 h-6 mr-2" />
          <span>Suggested Team for {map}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mt-2 py-2 px-4 bg-secondary rounded-2xl items-center">
          {
            //map && suggestedAgents && suggestedAgents[map]
            //? suggestedAgents[map].map((agent: string, index: number) => {
            suggestedAgents &&
              suggestedAgents.map((agent: string, index: number) => {
                return <VerticalAgentImage key={index} agent={agent} />;
              })
          }
        </div>
      </CardContent>
    </Card>
  );
};
