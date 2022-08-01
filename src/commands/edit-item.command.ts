import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {itemModel} from "../models/item.model";

export default class EditItemCommand extends BaseCommand {

  static command = "editar-item";

  static async run (message: Message, commandRequest: CommandType) {

    const valueString = commandRequest.args.pop();
    const value = Number(valueString);
    const property = commandRequest.args.pop();
    const itemName = commandRequest.args.join(" ");

    const item = await itemModel.findOne({ name: itemName }).exec();

    if (!item) {
      throw new Error("El item ingresado no existe 😰");
    }

    if (!value) {
      throw new Error(`El value ${value} no es valido`);
    }

    switch (property) {
      case "agua":
        item.properties.water = value;
        break;
      case "comida":
        item.properties.food = value;
        break;
      case "gasolina":
        item.properties.gas = value;
        break;
      case "salud":
        item.properties.health = value;
        break;
      case "servicio":
        item.properties.service = value;
        break;
      default:
        throw new Error(`La categoria ${property} no existe`);
    }

    await item.save();

    await message.reply(`El item ${itemName} esta actualizado`);

  }

}