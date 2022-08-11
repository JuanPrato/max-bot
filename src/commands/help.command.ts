import BaseCommand from "./base.command";
import commandsCache from "../cache/command.cache";
import {EmbedBuilder, Message} from "discord.js";

export default class HelpCommand extends BaseCommand {

  static command = "help";

  static async run(message: Message) {

    const isAdmin = message.member!.permissions.has("Administrator");
    const commands = Array.from(commandsCache.values());

    console.log(commands);

    await message.reply({
      embeds: [
        EmbedBuilder.from({})
          .setTitle("Comandos")
          .setDescription(commands.map((c) => (!c.adminOnly || isAdmin) ? `\`${c.command}\` : \`${c.validArgs.join(" ")}\`` : "").filter(c => c !== "").join("\n"))
          .setColor(0x00ff00)
      ]
    });
  }

}