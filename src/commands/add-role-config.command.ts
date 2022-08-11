import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {configModel} from "../models/config.model";
import configCache from "../cache/config.cache";
import {createEmbedAlert} from "../utils/embed.utils";
import {profileModel} from "../models/profile.model";
import profileManager from "../managers/profile.manager";
import {IProperties} from "../types/item.type";
import {IProfile} from "../types/profile.type";

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

      const userToCreate: IProfile[] = [];

      role.members.forEach(m => {
        userToCreate.push(new profileModel({
          guildId: m.guild.id,
          discordId: m.id
        }));
      });

      await profileManager.saveMany(userToCreate);

    } else {
      await config.updateOne({
        $set: {
          acceptedRoles: [...config.acceptedRoles, role.id]
        }
      }).exec();
    }

    configCache.set(message.guildId!, config);
    await message.reply({ embeds: [createEmbedAlert("Role config updated")] });

  }

}