
import { BotManagerLayout } from "@/components/bot-manager/BotManagerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Command, MessageSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { BotStats } from "@/lib/BotManager";

export default function Index() {
  const [stats, setStats] = useState<BotStats>({
    messagesReceived: 0,
    messagesSent: 0,
    commandsExecuted: 0,
    startTime: Date.now(),
    lastActivity: Date.now()
  });

  return (
    <BotManagerLayout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Commands"
            value={stats.commandsExecuted.toString()}
            icon={Command}
            trend="+3 this week"
          />
          <StatCard
            title="Messages Received"
            value={stats.messagesReceived.toString()}
            icon={Users}
            trend="+2 this week"
          />
          <StatCard
            title="Messages Sent"
            value={stats.messagesSent.toString()}
            icon={MessageSquare}
            trend="+123 today"
          />
          <StatCard
            title="Uptime"
            value={`${Math.floor((Date.now() - stats.startTime) / 1000 / 60)} min`}
            icon={Activity}
            trend="Active"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-discord-sidebar/50 border-discord-channel">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-lg bg-discord-channel/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-discord-success" />
                    <div>
                      <p className="font-medium">Command Executed</p>
                      <p className="text-sm text-gray-400">
                        !help in #general
                      </p>
                    </div>
                    <span className="ml-auto text-sm text-gray-400">2m ago</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-discord-sidebar/50 border-discord-channel">
            <CardHeader>
              <CardTitle>Popular Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-lg bg-discord-channel/50"
                  >
                    <Command className="w-5 h-5 text-discord-primary" />
                    <div>
                      <p className="font-medium">!help</p>
                      <p className="text-sm text-gray-400">
                        Shows available commands
                      </p>
                    </div>
                    <span className="ml-auto text-sm text-gray-400">
                      Used 156 times
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BotManagerLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: typeof Command;
  trend: string;
}) {
  return (
    <Card className="bg-discord-sidebar/50 border-discord-channel">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-discord-primary/20">
            <Icon className="w-6 h-6 text-discord-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-discord-success">{trend}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
