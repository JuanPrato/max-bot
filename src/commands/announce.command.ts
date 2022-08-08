import BaseCommand from "./base.command";
import {Message, TextChannel} from "discord.js";
import {CommandType} from "../types/command.type";
import {createEmbedAlert} from "../utils/embed.utils";

export default class AnnounceCommand extends BaseCommand {

  static command = "msg";
  static adminOnly = true;
  static async run (message: Message, command: CommandType) {

    const channel = message.mentions.channels.first();

    if (!channel) {
      throw new Error("Debes mencionar un canal");
    }

    command.args.shift();

    const announce = command.args.join(" ");

    if (channel.isTextBased()) {
      await (channel as TextChannel).send({
        embeds: [createEmbedAlert(announce, undefined, true)],
      });
    }

  }

}