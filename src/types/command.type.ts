import { User } from "discord.js";

export type CommandType = {
  name: string;
  args: string[];
  user: User;
}