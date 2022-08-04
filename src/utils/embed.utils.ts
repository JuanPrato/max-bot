import {Colors, EmbedBuilder} from "discord.js";

export const createEmbedAlert = (title: string, color?: number) => EmbedBuilder.from({
  title,
  color: color || Colors.Green
});