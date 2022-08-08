import BaseCommand from "../commands/base.command";
import {Colors, Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {profileModel} from "../models/profile.model";
import {createEmbedAlert} from "../utils/embed.utils";
import {workCache} from "../cache/work.cache";
import {dateOn} from "../utils/helpers";
import profileManager from "../managers/profile.manager";

export default class EndWorkCommand extends BaseCommand {

  static command = "fin-trabajo";

  static async run (message: Message, command: CommandType) {

    const quantity = command.args[0];

    if (!quantity) {
      throw new Error("Debes ingresar una cantidad");
    }
    if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      throw new Error("Debes ingresar una cantidad valida");
    }

    if (workCache.has(message.author.id) && workCache.get(message.author.id)!.getTime() > Date.now()) {
      await message.reply({
        embeds: [
          createEmbedAlert("No puedes terminar trabajos tan rápido. Espera a que terminé el cooldown",
            Colors.Yellow
          )
        ]});
      return;
    }

    let user = await profileManager.getProfileByDS(message.member);

    if (!user) {

      const newProfile = new profileModel({ discordId: command.user.id });

      user = await newProfile.save();
    }

    await user.updateOne({
      $inc: {
        "checks": quantity
      }
    }).exec();

    workCache.set(message.author.id, dateOn(1));

    await message.reply({
      embeds: [createEmbedAlert(`Se agregó ${quantity} a cheques`)]
    });
  }

}