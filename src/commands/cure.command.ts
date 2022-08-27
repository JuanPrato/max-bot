import BaseCommand from "./base.command";
import {Message} from "discord.js";
import userManager from "../managers/user.manager";
import {getMemberByUser} from "../utils/helpers";
import {createEmbedAlert} from "../utils/embed.utils";
import configCache from "../cache/config.cache";

export default class CureCommand extends BaseCommand {

  static command = "emscurar";

  static async run (message: Message) {

    const config = configCache.get(message.guild!.id);

    console.log(message.member?.roles);
    if (!message.member!.permissions.has("Administrator") &&
      (!config || !config.cureRoles.some(r => message.member!.roles.cache.has(r)))) return;

    const mention = message.mentions.users.first();

    if (!mention) {
      throw new Error("Debe mencionar un usuario");
    }

    const user = await userManager.getUserWithDSMember(getMemberByUser(message.guild!, mention));

    if (!user) {
      throw new Error("El usuario mencionado no tiene ningún usuario registrado");
    }

    await user.updateOne({
      $set: {
        "diseases.dehydration": false,
        "diseases.malnutrition": false,
        "diseases.cough": false,
        "diseases.dementia": false,
        "diseases.cancer": false,
      }
    }).exec();

    await message.reply({
      embeds: [createEmbedAlert(`${mention.username} ha sido curado`)]
    })

  }

}