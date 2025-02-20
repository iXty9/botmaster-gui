
import { Client, ChannelType } from "discord.js";
import { Bot } from "@/types/bot";

export interface BotStats {
  messagesReceived: number;
  messagesSent: number;
  commandsExecuted: number;
  startTime: number;
  lastActivity: number;
  uptime?: number;
  lastActivityAgo?: number;
}

export interface ChannelInfo {
  id: string;
  name: string;
  guildName: string;
  guildId: string;
  type: 'forum' | 'text';
  threads?: Array<{
    id: string;
    name: string;
  }>;
}

export class BotManager {
  private client: Client;
  private stats: BotStats;
  private logs: Array<{ log: string; timestamp: number }>;
  private maxLogs: number;

  constructor(client: Client) {
    this.client = client;
    this.maxLogs = 50;
    this.logs = [];
    
    // Initialize statistics
    this.stats = {
      messagesReceived: 0,
      messagesSent: 0,
      commandsExecuted: 0,
      startTime: Date.now(),
      lastActivity: Date.now()
    };
  }

  public getUsageStats(): BotStats {
    return {
      ...this.stats,
      uptime: Math.floor((Date.now() - this.stats.startTime) / 1000),
      lastActivityAgo: Math.floor((Date.now() - this.stats.lastActivity) / 1000)
    };
  }

  public getLogs(): Array<{ log: string; timestamp: number }> {
    return [...this.logs];
  }

  public async changeStatus(newStatus: "online" | "idle" | "dnd" | "invisible"): Promise<string> {
    try {
      await this.client.user?.setStatus(newStatus);
      this.stats.commandsExecuted++;
      this.stats.lastActivity = Date.now();
      return `Status changed to ${newStatus}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to change status: ${message}`);
    }
  }

  public async listChannels(): Promise<ChannelInfo[]> {
    const channels: ChannelInfo[] = [];
    
    for (const guild of this.client.guilds.cache.values()) {
      const guildChannels = await guild.channels.fetch();
      
      for (const channel of guildChannels.values()) {
        if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildForum) {
          const channelInfo: ChannelInfo = {
            id: channel.id,
            name: channel.name,
            guildName: guild.name,
            guildId: guild.id,
            type: channel.type === ChannelType.GuildForum ? 'forum' : 'text'
          };

          if (channel.type === ChannelType.GuildForum) {
            const threads = await channel.threads.fetch();
            channelInfo.threads = threads.threads.map(thread => ({
              id: thread.id,
              name: thread.name
            }));
          }

          channels.push(channelInfo);
        }
      }
    }
    
    return channels;
  }

  public async restart(): Promise<string> {
    try {
      await this.client.destroy();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.client.login(process.env.DISCORD_TOKEN);
      return 'Bot successfully restarted';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to restart bot: ${message}`);
    }
  }

  private log(message: string) {
    const timestamp = Date.now();
    const logEntry = {
      log: `${new Date(timestamp).toISOString()} - [BotManager] ${message}`,
      timestamp
    };

    this.logs.unshift(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }
}
