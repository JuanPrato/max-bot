import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {configModel} from "../models/config.model";
import configCache from "../cache/config.cache";
import {createEmbedAlert} from "../utils/embed.utils";

export default class AddRoleConfigCommand extends BaseCommand {

  static command = "add-role-config";
  static adminOnly = true;
  static async run (message: Message, command: CommandType) {

    let config = configCache.get(message.guildId!);
    const role = message.mentions.roles.first();

    if (!role) {
      throw new Error("Please mention a role");
    }

    if (!config) {
      config = new configModel({
        guildId: message.guildId!
      });
      await config.save();
    }

    if (config.acceptedRoles.includes(role.id)) {
      await config.updateOne({
        $set: {
          acceptedRoles: config.acceptedRoles.filter(r => r !== role.id)
        }
      }).exec();
    } else {
      await config.updateOne({
        $set: {
          acceptedRoles: [...config.acceptedRoles, role.id]
        }
      }).exec();
    }

    await message.reply({ embeds: [createEmbedAlert("Role config updated")] });

  }

}