
import { SidebarProvider } from "@/components/ui/sidebar";
import { BotSidebar } from "./BotSidebar";
import { useState, useEffect } from "react";
import { Bot } from "@/types/bot";
import { BotManager } from "@/lib/BotManager";
import { Client, GatewayIntentBits } from "discord.js";
import { toast } from "sonner";

// Set up global object if it doesn't exist
if (typeof global === 'undefined') {
  (window as any).global = window;
}

export function BotManagerLayout({ children }: { children: React.ReactNode }) {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [botManager, setBotManager] = useState<BotManager | null>(null);

  useEffect(() => {
    const initializeBot = async () => {
      try {
        const client = new Client({
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
          ],
          rest: {
            version: '10'
          }
        });

        // Initialize bot manager
        const manager = new BotManager(client);
        setBotManager(manager);

        // Update selected bot with real data
        setSelectedBot({
          id: client.user?.id || "1",
          name: client.user?.username || "Bot",
          status: "online",
          avatar: client.user?.avatarURL() || "/placeholder.svg",
        });

        toast.success("Bot manager initialized successfully");
      } catch (error) {
        console.error("Failed to initialize bot:", error);
        toast.error("Failed to initialize bot manager");
      }
    };

    initializeBot();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-discord-background text-white">
        <BotSidebar 
          selectedBot={selectedBot} 
          onBotSelect={setSelectedBot} 
        />
        <main className="flex-1 h-screen overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
