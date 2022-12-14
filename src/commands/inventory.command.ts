import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, Message} from "discord.js";
import {CommandType} from "../types/command.type";
import BaseCommand from "./base.command";
import {getInventoryEmbeds, getMemberByUser, paginationMessage} from "../utils/helpers";
import userManager from "../managers/user.manager";

export default class InventoryCommand extends BaseCommand {

  static command = "inv";

  static async run(message: Message, commandRequest: CommandType) {

    const selectedUser = message.mentions.members?.first() || message.member!;
    let user = await userManager.getUserWithDSMember(selectedUser);

    if (!user) {
      user = await userManager.createEmptyUser(message.author.id, message.guildId!);
    }

    const inventory = user.inventory;
    let embed;

    if (!inventory.length) {
      embed = EmbedBuilder.from({
        title: `Inventario de ${selectedUser.user.username}`,
        description: "No tienes ningún item en tu inventario, puedes comprar algunos en la tienda",
        color: Colors.DarkRed,
        thumbnail: {
          url: selectedUser.user.avatarURL()!
        },
      });
      await message.reply({
        embeds: [embed]
      });
      return;
    }

    const embeds: EmbedBuilder[] = getInventoryEmbeds(user, message.author.username);

    await paginationMessage(message, embeds);
  }
}