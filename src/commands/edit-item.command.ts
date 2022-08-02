import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {itemModel} from "../models/item.model";
import { getTranslatedProperty } from "../utils/translate";

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

    switch (property) {
      case "agua":
      case "comida":
      case "gasolina":
      case "salud":
      case "servicio":
        if (!value) {
          throw new Error(`El value ${value} no es valido`);
        }

        (item.properties as any)[getTranslatedProperty(property)] = value;
        break;
      case "role":
        const role = message.mentions.roles.first();
        if (!role) {
          throw new Error("Debe mencionar un role");
        }
        let newRoles;
        const roleFound = item.roles.find(r => r === role.id);
        if (roleFound) {
          newRoles = item.roles.filter(r => r !== role.id);
        } else {
          newRoles = [...item.roles, role.id];
        }
        await item.updateOne({
          $set: {
            roles: newRoles
          }
        }).exec();
        break;
      default:
        throw new Error(`La categoria ${property} no existe`);
    }

    await item.save();

    await message.reply(`El item ${itemName} esta actualizado`);

  }

}