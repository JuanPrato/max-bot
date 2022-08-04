import {Colors, EmbedBuilder, Message} from "discord.js";
import { userModel } from "../models/user.model";
import { CommandType } from "../types/command.type";
import BaseCommand from "./base.command";
import {IProperties} from "../types/item.type";
import {getEmoji, getEnglishProperties, getTranslatedProperty} from "../utils/translate";
import {createNewProperties, getInventoryEmbed, getStatsFromItem} from "../utils/helpers";



export default class InventoryCommand extends BaseCommand {

    static command = "inventario";

    static async run ( message: Message, commandRequest: CommandType ) {

        let user = await userModel.findOne({ discordId: message.author.id }).exec();

        if ( !user ) {
            user = new userModel({
              discordId: message.author.id,
              inventory: [],
              properties: createNewProperties()
            });
            await userModel.create(user);
        }

        const inventory = user.inventory;
        let embed;

        if ( !inventory.length ) {
            embed = EmbedBuilder.from({
              title: `Inventario de ${message.author.username}`,
              description: "No tienes ningún item en tu inventario, puedes comprar algunos en la tienda",
              color: Colors.DarkRed,
              thumbnail: {
                url: message.author.avatarURL()!
              },
            });
        } else {
          embed = getInventoryEmbed(user, message.author.username);
        }


        await message.reply({
          embeds: [embed]
        });

    }

}