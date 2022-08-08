import BaseCommand from "./base.command";
import {Message} from "discord.js";
import configCache from "../cache/config.cache";
import {configModel} from "../models/config.model";
import {createEmbedAlert} from "../utils/embed.utils";

export default class AddBilledRoleCommand extends BaseCommand {

  static command = "addfacrole";
  static adminOnly = true;
  static async run (message: Message) {

      const role = message.mentions.roles.first();

      if (!role) {
        throw new Error("Debes mencionar un rol");
      }

      let guildConfig = configCache.get(message.guildId!);

      if (!guildConfig) {
          guildConfig = new configModel({ guildId: message.guildId! });
          await guildConfig.save();
          configCache.set(message.guildId!, guildConfig);
      }

      if (guildConfig.billedRoles.some(r => r === role.id)) {
          throw new Error("El rol ya está agregado");
      }

      guildConfig.billedRoles.push(role.id);

      await guildConfig.save();

      await message.reply({
        embeds: [createEmbedAlert(`Rol ${role.name} agregado correctamente`)]
      });

  }

}