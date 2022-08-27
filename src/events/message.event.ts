import {client} from "../bot";
import commandsCache from "../cache/command.cache";
import {parseCommand} from "../utils/helpers";
import {Colors, Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import {IConfig} from "../types/config.type";
import configCache from "../cache/config.cache";

const checkCorrectCommand = (message: Message, prefix: string, config: IConfig | undefined) => {
  if (message.author.bot) return false;
  if (!message.guild) return false;
  if (!message.member!.permissions.has("Administrator") && !config?.acceptedRoles.some(r => message.member!.roles.cache.has(r))) return false;
  return message.content.startsWith(prefix);
}

client.on("messageCreate", async (message) => {

  const PREFIX = process.env.ENV === "dev" ? "D!" : "L!";

  if (!checkCorrectCommand(message, PREFIX, configCache.get(message.guildId ?? ""))) return;

  const commandRequest = parseCommand(PREFIX.length, message);

  const command = commandsCache.get(commandRequest.name);

  if (!command) return;

  if (command.adminOnly) {
    if (!message.member?.permissions.has("Administrator")) return;
  }
  try {
    await command.run(message, commandRequest);
  } catch (e) {
    await message.reply({
      embeds: [createEmbedAlert(`Error con el commando: ${(e as Error).message}`, Colors.Red)]
    });
  }

});