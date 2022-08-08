import BaseCommand from "../commands/base.command";
import {Message} from "discord.js";
import {configModel} from "../models/config.model";
import configCache from "../cache/config.cache";
import {createEmbedAlert} from "../utils/embed.utils";

export default class AddCureRoleCommand extends BaseCommand {

  static command = "emsrole";
  static adminOnly = true;
  static async run (message: Message) {

    const role = message.mentions.roles.first();

    if (!role) {
      throw new Error("Debe mencionar un rol");
    }

    const config = configCache.get(message.guild!.id);

    if (!config) {
      throw new Error("No se pudo encontrar la configuración del servidor");
    }

    if (config.cureRoles.some(r => r === role.id)) {
      throw new Error("El rol ya está en la lista");
    }

    config.cureRoles.push(role.id);

    await configModel.findOneAndUpdate({guildId: message.guild!.id}, config);

    await message.reply({ embeds: [createEmbedAlert(`Se ha agregado el rol ${role.name} a la lista de roles que pueden curar`)]});

  }

}