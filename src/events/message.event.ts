import { client } from "../bot";
import commandsCache from "../cache/command.cache";
import { parseCommand } from "../utils/helpers";

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  const PREFIX = "-";

  if (!message.content.startsWith(PREFIX)) return;

  const commandRequest = parseCommand(message);

  const command = commandsCache.get(commandRequest.name);

  if (!command) return;

  await command.run(message, commandRequest);

});