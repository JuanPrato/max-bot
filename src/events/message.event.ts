import { client } from "../bot";
import commandsCache from "../cache/command.cache";
import { parseCommand } from "../utils/helpers";

client.on("messageCreate", async (message) => {

    if (message.author.bot) return;
    if (!message.guild) return;

    const PREFIX = "!";

    if (!message.content.startsWith(PREFIX)) return;

    const commandRequest = parseCommand(message);

    const command = commandsCache.get(commandRequest.name);

    if (!command) return;

    try {
      await command.run(message, commandRequest);
  } catch (e) {
    await message.reply(`Error con el commando: ${(e as Error).message}`);
  }

});