"use client";
import { Dashboard } from "./_components/dashboard";

import Image from "next/image";
import ChatBot from "./_components/chatbot";
import { useState } from "react";
import StatusSidebar from "../../../components/status-sidebar";

const Main = () => {
  const [playerIds, setPlayerIds] = useState<any[]>(["106116564871354330"]);
  //const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  console.log(playerIds);
  return (
    <div className="relative flex h-screen w-[100vw] overflow-hidden items-center">
      <div className="relative flex-grow flex h-screen justify-center overflow-hidden">
        <div className="relative h-full w-full col-span-12 overflow-y-hidden max-w-[900px]">
          <ChatBot
            playerIds={playerIds}
            setPlayerIds={setPlayerIds}
            setSession={setSessionId}
          />
        </div>
      </div>

      <div className="relative h-screen">
        <StatusSidebar />
      </div>
    </div>
  );
};

export default Main;
