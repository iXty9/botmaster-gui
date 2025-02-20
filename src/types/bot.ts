
export interface Bot {
  id: string;
  name: string;
  status: "online" | "offline" | "idle";
  avatar: string;
}
