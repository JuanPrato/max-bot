import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {itemModel} from "../models/item.model";

export default class CreateItemCommand extends BaseCommand {

  static command = "crear-item";

  static async run (message: Message, commandRequest: CommandType) {

    const name = commandRequest.args.join(" ");

    if (!name) {
      throw new Error("Debe ingresar el nombre");
    }

    const item = new itemModel({
      name
    });

    await item.save();

    await message.reply(`Item creado con el nombre de "${item.name}"`);

  }

}