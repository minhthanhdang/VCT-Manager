import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileTab from "../_components/ProfileTab";

const Individuals = () => {
  const [profiles, setProfiles] = React.useState<any[]>([]);
  return (
    <Tabs defaultValue={profiles[0].id} className="w-full h-full pb-20">
      <TabsList className="grid w-full grid-cols-5 overflow-hidden bg-black">
        {profiles.map((profile: any) => (
          <TabsTrigger
            value={profile.id}
            key={profile.id}
            className="overflow-hidden "
          >
            {profile.first_name} {profile.last_name}
          </TabsTrigger>
        ))}
      </TabsList>

      {profiles.map((profile: any) => (
        <TabsContent
          value={profile.id}
          key={profile.id}
          className="relative w-full h-full"
        >
          <ProfileTab profile={profile} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Individuals;
