import {client} from "../bot";
import commandsCache from "../cache/command.cache";
import {parseCommand} from "../utils/helpers";
import {Colors, Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";

const checkCorrectCommand = (message: Message, prefix: string) => {
  if (message.author.bot) return false;
  if (!message.guild) return false;
  return message.content.startsWith(prefix);
}

client.on("messageCreate", async (message) => {
  const PREFIX = "L!";

  if (!checkCorrectCommand(message, PREFIX)) return;

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