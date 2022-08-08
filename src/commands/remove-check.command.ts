import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {profileModel} from "../models/profile.model";
import {createEmbedAlert} from "../utils/embed.utils";
import BaseCommand from "./base.command";
import profileManager from "../managers/profile.manager";
import {getMemberByUser} from "../utils/helpers";
import webhookManager from "../managers/webhook.manager";

export default class RemoveCheckCommand extends BaseCommand {

  static command = "remche";
  static description = "Remueve un cheque";
  static validArgs = ["@user", "quantity"];
  static adminOnly = true;

  static async run(message: Message, command: CommandType) {

    const mention = message.mentions.users.first();

    if (!mention) {
      throw new Error("No se especificó un usuario");
    }

    const quantity = command.args.pop();

    if (!quantity) {
      throw new Error("Debes ingresar una cantidad");
    }
    if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      throw new Error("Debes ingresar una cantidad valida");
    }

    let user = await profileManager.getProfileByDS(getMemberByUser(message.guild!, mention));

    if (!user) {

      const newProfile = new profileModel({ discordId: command.user.id });

      user = await newProfile.save();
    }

    if (user.checks <= 0) {
      await message.reply(`${mention.username} ya tiene 0 en cheques`);
      return;
    }

    await user.updateOne({
      $inc: {
        "checks": -quantity
      }
    }).exec();

    await message.reply({
      embeds: [createEmbedAlert(`Se removió ${quantity} de cheques`)]
    });

    await webhookManager.sendLog(message.guildId!, `Se removió ${quantity} a la cantidad de los cheques de ${mention.username}`, message.author.id);
  }

}