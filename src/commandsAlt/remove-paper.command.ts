import BaseCommand from "../commands/base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import profileManager from "../managers/profile.manager";
import {getMemberByUser} from "../utils/helpers";
import {createEmbedAlert} from "../utils/embed.utils";

export default class RemovePaperCommand extends BaseCommand {

  static command = "rempapel";
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

    if (command.args.length < 2) {
      throw new Error("Debes ingresar un número de papel");
    }

    const paperNumber = parseInt(command.args[1]);

    if (isNaN(paperNumber)) {
      throw new Error("Debes ingresar un número de papel");
    }

    if (profile.papers.length <= paperNumber) {
      throw new Error("El número de papel es mayor al número de papeles que tiene");
    }

    profile.papers.splice(paperNumber, 1);
    await profile.save();

    await message.reply({
      embeds: [createEmbedAlert(`Papel ${paperNumber} eliminado correctamente`)]
    });
  }
}