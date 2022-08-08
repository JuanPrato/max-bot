import {Colors, EmbedBuilder} from "discord.js";

export const createEmbedAlert = (title: string, color?: number, timestamp?: boolean) => EmbedBuilder.from({
  title,
  color: color || Colors.Green,
  timestamp: timestamp ? new Date().toISOString() : undefined,
});