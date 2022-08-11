import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import userManager from "../managers/user.manager";
import {createEmbedAlert} from "../utils/embed.utils";

export default class SendItemCommand extends BaseCommand {

  static command = "enviar-item";

  static async run (message: Message, command: CommandType) {

    const itemIndex = command.args.shift();
    const mention = message.mentions.members?.first();

    if (!itemIndex || isNaN(Number(itemIndex))) {
      throw new Error("Por favor ingresar un numero de item");
    }

    if (!mention) {
      throw new Error("Por favor mencionar a un usuario");
    }

    const user = await userManager.getUserWithDSMember(message.member!);
    const userToSend = await userManager.getUserWithDSMember(mention);

    if (!userToSend) {
      throw new Error(`El usuario al que mencionaste no existe`);
    }

    const item = user?.inventory[Number(itemIndex)];
    if (!item) {
      throw new Error("El item no existe");
    }
    userToSend.inventory.push(item)
    await userToSend.updateOne({
      $set: {
        inventory: userToSend.inventory
      }
    }).exec();

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      user.inventory.splice(Number(itemIndex), 1);
    }

    await user.save();

    await message.reply({
      embeds: [
        createEmbedAlert(`${mention.user.username} ha recibido el item ${item.name});`)
      ]});
  }

}