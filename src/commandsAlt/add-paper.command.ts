import BaseCommand from "../commands/base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import profileManager from "../managers/profile.manager";
import {getMemberByUser} from "../utils/helpers";
import {IPaper} from "../types/profile.type";
import {createEmbedAlert} from "../utils/embed.utils";
import webhookManager from "../managers/webhook.manager";

export default class AddPaperCommand extends BaseCommand {

  static command = "addpapel";
  static adminOnly = true;
  static async run (message: Message, command: CommandType) {

    const mention = message.mentions.users.first();

    if (!mention) {
      throw new Error("Debes mencionar a un usuario");
    }

    let profile = await profileManager.getProfileByDS(getMemberByUser(message.guild!, mention));

    if (!profile) {
      profile = await profileManager.createWithMember(getMemberByUser(message.guild!, mention));
    }

    command.args.shift();

    const text = command.args.join(" ");

    const newPaper: IPaper = {
      title: text
    } as IPaper;

    profile.papers.push(newPaper);

    await profile.save();

    await message.reply({
      embeds: [createEmbedAlert(`Papel ${text} agregado correctamente`)]
    });

    await webhookManager.sendLog(message.guildId!, `Se agregó el papel ${text} a ${mention.username}`, message.author.id);

  }


}