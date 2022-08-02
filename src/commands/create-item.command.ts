import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {itemModel} from "../models/item.model";

export default class CreateItemCommand extends BaseCommand {

  static command = "crear-item";
  static validArgs = ["item"];
  static adminOnly = true;
  static async run (message: Message, commandRequest: CommandType) {

    if (!message.member!.permissions.has("Administrator")) return;

    const name = commandRequest.args.join(" ");

    if (!name) {
      throw new Error("Debe ingresar el nombre");
    }

    const item = new itemModel({
      name,
      properties: {
        water: 0,
        food: 0,
        gas: 0,
        health: 0,
        service: 0
      }
    });

    await item.save();

    await message.reply(`Item creado con el nombre de "${item.name}"`);

  }

}