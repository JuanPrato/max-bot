import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import userManager from "../managers/user.manager";
import {createEmbedAlert} from "../utils/embed.utils";
import {IUserItem} from "../types/user.type";

export default class SendItemCommand extends BaseCommand {

  static command = "enviar-item";

  static async run (message: Message, command: CommandType) {

    const quantityAsked = parseInt(isNaN(Number(command.args.at(-1))) ? "1" : command.args.pop() || "1");
    const itemIndex = command.args.shift();
    const mention = message.mentions.members?.first();

    if (!itemIndex || isNaN(Number(itemIndex))) {
      throw new Error("Por favor ingresar un numero de item");
    }

    if (!mention) {
      throw new Error("Por favor mencionar a un usuario");
    }

    if (message.member?.id === mention.id) {
      throw new Error("No puedes enviar items a ti mismo");
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

    if (item.quantity < quantityAsked) {
        throw new Error("No tienes suficiente cantidad de este item");
    }

    const indexFound = userToSend.inventory.findIndex(i => i.name === item.name);

    const newItems: IUserItem[] = [...userToSend.inventory];

    if (indexFound !== -1) {
        userToSend.inventory[indexFound].quantity += quantityAsked;
    } else {
        newItems.push({ name: item.name, quantity: quantityAsked, properties: item.properties } as IUserItem);
    }

    await userToSend.updateOne({
      $set: {
        inventory: newItems
      }
    }).exec();

    await userToSend.save();


    if (item.quantity > quantityAsked) {
      item.quantity -= quantityAsked;
    } else {
      user.inventory.splice(Number(itemIndex), 1);
    }

    await user.save();

    await message.reply({
      embeds: [
        createEmbedAlert(`${mention.user.username} ha recibido el item ${item.name}`)
      ]});
  }

}