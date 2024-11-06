"use client"
import { Dashboard } from "./_components/dashboard"

import Image from "next/image"
import ChatBot from "./_components/chatbot"
import { useState } from "react"

const Main = () => {
  const [playerIds, setPlayerIds] = useState<any[]>(["106116564871354330"]);
  //const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  console.log(playerIds)
  return (
    <div className="relative p-6 flex flex-col gap-2 h-[100vh] w-[100vw] bg-black overflow-hidden">
      <div className="h-[50px]">
      <Image src="/logo.png" alt="Logo" width={200} height={50} className="ms-[20px]"/>
      </div>
      <div className="relative h-full w-full flex-grow p-2 bg-black border-red-600 border-[6px] grid grid-cols-12 overflow-hidden gap-2">
        <div className="relative h-full flex col-span-6 overflow-hidden">
          <Dashboard players={playerIds} sessionId={sessionId}/>
        </div>
        
        <ChatBot playerIds={playerIds} setPlayerIds={setPlayerIds} setSession={setSessionId}/>
      
      </div>
    </div>
  )
}

export default Main