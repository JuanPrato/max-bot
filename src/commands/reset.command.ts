import BaseCommand from "./base.command";
import {Message} from "discord.js";
import userManager from "../managers/user.manager";
import {createEmbedAlert} from "../utils/embed.utils";

export default class ResetCommand extends BaseCommand {

  static command = "reset";
  static adminOnly = true;

  static async run(message: Message,) {

    const mention = message.mentions.members?.first();

    if (!mention) {
      throw new Error("Debe mencionar a un miembro");
    }

    const user = await userManager.getUserWithDSMember(mention);

    if (!user) {
      throw new Error("El usuario no tiene ningún registro");
    }

    await userManager.resetUser(user);

    await message.reply({ embeds: [createEmbedAlert("Se ha reseteado el usuario")]});

  }
}