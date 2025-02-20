
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bot } from "@/types/bot";
import { Bot as BotIcon, Plus, Settings } from "lucide-react";

interface BotSidebarProps {
  selectedBot: Bot | null;
  onBotSelect: (bot: Bot) => void;
}

const dummyBots: Bot[] = [
  {
    id: "1",
    name: "ModBot",
    status: "online",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "MusicBot",
    status: "idle",
    avatar: "/placeholder.svg",
  },
];

export function BotSidebar({ selectedBot, onBotSelect }: BotSidebarProps) {
  return (
    <Sidebar className="w-64 bg-discord-sidebar border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 px-4">
            Your Bots
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dummyBots.map((bot) => (
                <SidebarMenuItem key={bot.id}>
                  <SidebarMenuButton
                    onClick={() => onBotSelect(bot)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      selectedBot?.id === bot.id
                        ? "bg-discord-primary/20 text-white"
                        : "hover:bg-discord-channel/50 text-gray-300"
                    }`}
                  >
                    <div className="relative">
                      <BotIcon className="w-6 h-6" />
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-discord-sidebar ${
                          bot.status === "online"
                            ? "bg-discord-success"
                            : "bg-discord-warning"
                        }`}
                      />
                    </div>
                    <span className="truncate">{bot.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-discord-channel/50 rounded-lg transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  <span>Add New Bot</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-discord-channel/50 rounded-lg transition-colors">
                  <Settings className="w-6 h-6" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
