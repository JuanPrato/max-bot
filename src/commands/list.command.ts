import BaseCommand from "./base.command";
import {Embed, Message} from "discord.js";
import {itemModel} from "../models/item.model";

export default class ListCommand extends BaseCommand {

  static command = "list";

  static async run(message: Message, ) {

    const items = await itemModel.find({}).exec();

    await message.reply(items.reduce((acc, i) => acc + "\n" + i.stock + " " + i.name, ""));

  }

}