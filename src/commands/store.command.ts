import { EmbedBuilder, Message } from "discord.js";
import { itemModel } from "../models/item.model";
import BaseCommand from "./base.command";
import {IItem, IProperties} from "../types/item.type";
import {getEmoji, getEnglishProperties, getTranslatedProperty} from "../utils/translate";

const getStatsFromItem = (properties: IProperties) => {
  const propertiesList = getEnglishProperties();

  return propertiesList.reduce((acc, p ) =>
    acc + (properties[p as keyof IProperties] > 0 ? ` | ${getEmoji(p)} ${getTranslatedProperty(p)} : ${properties[p as keyof IProperties]}` : ""), "");
}

export default class StoreCommand extends BaseCommand {

    static command = "tienda";

    static async run(message: Message, ) {

        const items = await itemModel.find({}).exec();

        const embed = EmbedBuilder.from({
            title: "Tienda",
            fields: items.map((i) => ({
                name: `${i.name}: ${getStatsFromItem(i.properties)}`,
                value: `Roles que puede comprar:\n ${i.roles.length ? i.roles.map((r) => `<@&${r}>`).join(" ") : "@everyone"}`
            })),
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
        });

        await message.reply({
            embeds: [embed]
        })

    }
}