import {EmbedBuilder, Message} from "discord.js";
import { userModel } from "../models/user.model";
import { CommandType } from "../types/command.type";
import BaseCommand from "./base.command";
import {IProperties} from "../types/item.type";
import {getEmoji, getEnglishProperties, getTranslatedProperty} from "../utils/translate";

const getStatsFromItem = (properties: IProperties) => {
  const propertiesList = getEnglishProperties();

  return propertiesList.reduce((acc, p ) =>
    acc + (properties[p as keyof IProperties] > 0 ? ` | ${getEmoji(p)} ${getTranslatedProperty(p)} : ${properties[p as keyof IProperties]}` : ""), "");
}

export default class InventoryCommand extends BaseCommand {

    static command = "inventario";

    static async run ( message: Message, commandRequest: CommandType ) {

        let user = await userModel.findOne({ discordId: message.author.id }).exec();

        if ( !user ) {
            user = new userModel({
                discordId: message.author.id,
                inventory: [],
                properties: {
                    water: 100,
                    food: 100,
                    gas: 100,
                    health: 100,
                    service: 100
                }
            });
            await userModel.create(user);
        }

        const inventory = user.inventory;

        if ( !inventory.length ) {
            await message.reply("No tienes ningun item en tu inventario");
            return;
        }

        const embed = EmbedBuilder.from({
          title: `Inventario de ${message.author.username}`,
          fields: user.inventory.map( item => ({ name: `${item.name} - ${item.quantity}`, value: getStatsFromItem(item.properties) })),
          color: 0x00ff00,
        });

        await message.reply({
          embeds: [embed]
        });

    }

}