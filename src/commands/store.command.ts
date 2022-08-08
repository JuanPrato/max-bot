import {
  EmbedBuilder,
  Message,
  ButtonStyle,
  ComponentType
} from "discord.js";
import { itemModel } from "../models/item.model";
import BaseCommand from "./base.command";
import {getStatsFromItem, paginationMessage} from "../utils/helpers";
import {IItem} from "../types/item.type";

export default class StoreCommand extends BaseCommand {

    static command = "tienda";

    static async run(message: Message, ) {

        const items = await itemModel.find({}).exec();

        const itemsArray: IItem[][] = [];

        for (let i = 0; i < items.length; i += 7) {
            itemsArray.push(items.slice(i, i + 7));
        }

        const embeds = itemsArray.map((items, index) => {
          return EmbedBuilder.from({
            title: "Tienda",
            fields: items.map((i) => ({
              name: `${i.name}:\n ${getStatsFromItem(i.properties, false).join(" | ")}\n`,
              value: `Roles que puede comprar:\n ${i.roles.length ? i.roles.map((r) => `<@&${r}>`).join(" ") : "@everyone"}`
            })),
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
          });
        });

        await paginationMessage(message, embeds);

    }
}