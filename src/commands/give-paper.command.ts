import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import profileManager from "../managers/profile.manager";
import {getMemberByUser} from "../utils/helpers";
import {createEmbedAlert} from "../utils/embed.utils";
import webhookManager from "../managers/webhook.manager";

export default class GivePaperCommand extends BaseCommand {

  static command = "darpapel";

  static async run (message: Message, command: CommandType) {

    const mention = message.mentions.users.first();

    if (!mention) {
      throw new Error("Debes mencionar a un usuario");
    }

    const paperNumber = command.args[1] ? Number(command.args[1]) : undefined;

    if (!paperNumber) {
      throw new Error("Debes ingresar un número de papel");
    }

    if (isNaN(paperNumber)) {
      throw new Error("Debes ingresar un número de papel");
    }

    let myProfile = await profileManager.getProfileByDS(message.member!);
    let profileToGive = await profileManager.getProfileByDS(getMemberByUser(message.guild!, mention));

    if (!myProfile) {
      myProfile = await profileManager.createWithMember(message.member!);
    }

    if (!profileToGive) {
      profileToGive = await profileManager.createWithMember(getMemberByUser(message.guild!, mention));
    }

    if (myProfile.papers.length <= paperNumber) {
      throw new Error("No tienes papeles suficientes");
    }

    const paper = myProfile.papers.splice(paperNumber, 1)[0];

    profileToGive.papers.push(paper);

    await myProfile.save();
    await profileToGive.save();

    await message.reply({
      embeds: [createEmbedAlert(`Papel ${paperNumber} dado correctamente`)]
    });

    await webhookManager.sendLog(message.guildId!, `Se dio el papel ${paperNumber} a ${mention.username}`, message.author.id);

  }

}