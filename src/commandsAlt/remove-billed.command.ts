import BaseCommand from "../commands/base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import configCache from "../cache/config.cache";
import profileManager from "../managers/profile.manager";

export default class RemoveBilledCommand extends BaseCommand {

  static command = "remfac";

  static async run (message: Message, command: CommandType) {

    if (!message.member!.permissions.has("Administrator")) {
      const guildConfig = configCache.get(message.guildId!);
      if (!guildConfig) return;

      if (!guildConfig.facturationRoles.some(r => message.member!.roles.cache.get(r) !== undefined)) return;
    }

    const mention = message.mentions.users.first();

    if (!mention) {
      throw new Error("Debes mencionar a un usuario");
    }

    const quantity = command.args[1];

    if (!quantity) {
      throw new Error("Debes indicar la cantidad");
    }

    const quantityNumber = parseInt(quantity);

    if (isNaN(quantityNumber)) {
      throw new Error("La cantidad debe ser un número");
    }

    let profile = await profileManager.getProfileByDS(message.guild!.members.cache.get(mention.id)!);

    if (!profile) {
      profile = await profileManager.createWithMember(message.guild!.members.cache.get(mention.id)!);
    }

    if (profile.billed < quantityNumber) {
      throw new Error("No tiene suficiente dinero facturado");
    }

    await profile.updateOne({
      $inc: {
        billed: -quantityNumber
      }
    }).exec();

  }
}