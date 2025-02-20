
import { SidebarProvider } from "@/components/ui/sidebar";
import { BotSidebar } from "./BotSidebar";
import { useState } from "react";

export interface Bot {
  id: string;
  name: string;
  status: "online" | "offline" | "idle";
  avatar: string;
}

export function BotManagerLayout({ children }: { children: React.ReactNode }) {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-discord-background text-white">
        <BotSidebar selectedBot={selectedBot} onBotSelect={setSelectedBot} />
        <main className="flex-1 h-screen overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
