
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
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeBot = async () => {
      console.log("Starting bot initialization...");
      
      if (!process.env.DISCORD_TOKEN) {
        const error = "Discord token not found in environment variables";
        console.error(error);
        setInitError(error);
        toast.error(error);
        return;
      }

      try {
        console.log("Creating Discord client...");
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
          console.log('Bot is ready!', {
            username: client.user?.username,
            id: client.user?.id,
            guilds: client.guilds.cache.size
          });
          toast.success(`Logged in as ${client.user?.tag}`);
        });

        client.on('error', (error) => {
          const errorMsg = `Discord client error: ${error.message}`;
          console.error(errorMsg, error);
          toast.error(errorMsg);
          setInitError(errorMsg);
        });

        client.on('debug', (info) => {
          console.log('Discord Debug:', info);
        });

        client.on('warn', (info) => {
          console.warn('Discord Warning:', info);
        });

        console.log("Attempting to login with Discord token...");
        await client.login(process.env.DISCORD_TOKEN);
        console.log("Login attempt completed");

        // Initialize bot manager
        console.log("Initializing bot manager...");
        const manager = new BotManager(client);
        setBotManager(manager);

        // Update selected bot with real data
        const botData: Bot = {
          id: client.user?.id || "1",
          name: client.user?.username || "Bot",
          status: "online",
          avatar: client.user?.avatarURL() || "/placeholder.svg",
        };
        console.log("Setting bot data:", botData);
        setSelectedBot(botData);

      } catch (error) {
        const errorMsg = `Failed to initialize bot: ${(error as Error).message}`;
        console.error(errorMsg, error);
        setInitError(errorMsg);
        toast.error(errorMsg);
      }
    };

    initializeBot();

    // Cleanup function
    return () => {
      console.log("Cleaning up bot manager...");
      if (botManager) {
        botManager.client.destroy();
        console.log("Bot client destroyed");
      }
    };
  }, []);

  if (initError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-discord-background text-white">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Initialization Error</h2>
          <p className="text-gray-400 mb-4">{initError}</p>
          <p className="text-sm text-gray-500">Check the console for more details</p>
        </div>
      </div>
    );
  }

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
