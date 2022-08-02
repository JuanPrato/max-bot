import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {itemModel} from "../models/item.model";

export default class RemoveItemCommand extends BaseCommand {

  static command = "borrar-item";

  static async run (message: Message, commandRequest: CommandType) {

    const itemName = commandRequest.args.join(" ");

    const item = await itemModel.findOne({ name: itemName }).exec();

    if (!item) {
      throw new Error("El item ingresado no existe 😰");
    }

    await item.remove();

    await message.reply(`El item ${itemName} esta actualizado`);

  }

}