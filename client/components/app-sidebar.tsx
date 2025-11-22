import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  ChatBubbleIcon,
  DashboardIcon,
  PersonIcon,
  MagnifyingGlassIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const items = [
  {
    title: "Conversation",
    url: "",
    icon: <ChatBubbleIcon />,
  },
  { title: "Team Composition", url: "dashboard", icon: <DashboardIcon /> },
  { title: "Individuals", url: "individuals", icon: <PersonIcon /> },
];

const addional_items = [
  { title: "All Players", url: "", icon: <MagnifyingGlassIcon /> },
  { title: "Game Information", url: "about", icon: <InfoCircledIcon /> },
];

export function AppSidebar() {
  return (
    <Sidebar className="py-6">
      <SidebarHeader>
        <div className="h-[50px]">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={50}
            className="ms-[20px]"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>
            <h3 className="font-semibold text-[14px]">Main</h3>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="rounded-xl">
                  <SidebarMenuButton asChild>
                    <Link href={"/main/" + item.url} className="py-4 px-4">
                      {item.icon}
                      <span className="font-medium text-[15px]">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <h3 className="font-semibold text-[14px]">
              Additional Information
            </h3>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {addional_items.map((item) => (
                <SidebarMenuItem key={item.title} className="rounded-xl">
                  <SidebarMenuButton asChild>
                    <Link href={"/main/" + item.url} className="py-4 px-4">
                      {item.icon}
                      <span className="font-medium text-[15px]">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
