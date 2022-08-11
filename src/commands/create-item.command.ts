import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {itemModel} from "../models/item.model";
import {createEmbedAlert} from "../utils/embed.utils";

export default class CreateItemCommand extends BaseCommand {

  static command = "crear-item";
  static validArgs = ["item"];
  static adminOnly = true;
  static async run (message: Message, commandRequest: CommandType) {

    const name = commandRequest.args.join(" ");

    if (!name) {
      throw new Error("Debe ingresar el nombre");
    }

    const itemFound = await itemModel.findOne({ name: name, guildId: message.guild!.id }).exec();

    if (itemFound) {
      throw new Error("El item ya existe");
    }

    const item = new itemModel({
      guildId: message.guild!.id,
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

    await message.reply({ embeds: [ createEmbedAlert(`Item creado con el nombre de "${item.name}"`)]});

  }

}