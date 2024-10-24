import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center min-h-screen py-[48px] font-[family-name:var(--font-geist-sans)]">
      <div className="font-bold text-[56px]">
        Welcome to VCT Esport Manager
      </div>
      <Link href="/main">
        <Button className="text-[22px] font-bold h-[48px] p-6 py-8  mb-6 bg-accent">
          Start building
        </Button>
      </Link>
      <Image src="/ValorantWallpaper_Ascent.jpg" className="-z-20 w-full" alt="Valorant Wallpaper" width={1960} height={1080}/>
      
    </div>
  );
}
