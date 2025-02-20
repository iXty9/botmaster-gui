
import { SidebarProvider } from "@/components/ui/sidebar";
import { BotSidebar } from "./BotSidebar";
import { useState, useEffect } from "react";
import { Bot } from "@/types/bot";
import { BotManager } from "@/lib/BotManager";
import { Client, GatewayIntentBits } from "discord.js";
import { toast } from "sonner";

export function BotManagerLayout({ children }: { children: React.ReactNode }) {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [botManager, setBotManager] = useState<BotManager | null>(null);

  useEffect(() => {
    const initializeBot = async () => {
      try {
        console.log("Initializing bot...");
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

        // Add event listeners
        client.on('ready', () => {
          console.log('Bot is ready!');
          toast.success(`Logged in as ${client.user?.tag}`);
        });

        client.on('error', (error) => {
          console.error('Discord client error:', error);
          toast.error(`Discord error: ${error.message}`);
        });

        // Login with token
        await client.login(process.env.DISCORD_TOKEN);
        console.log("Login attempt completed");

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

      } catch (error) {
        console.error("Failed to initialize bot:", error);
        toast.error("Failed to initialize bot manager: " + (error as Error).message);
      }
    };

    initializeBot();
  }, []);

  if (!selectedBot) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-discord-background text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Initializing Bot Manager...</h2>
          <p className="text-gray-400">Please wait while we connect to Discord</p>
        </div>
      </div>
    );
  }

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
