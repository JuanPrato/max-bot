import {Colors, EmbedBuilder, Message} from "discord.js";
import { itemModel } from "../models/item.model";
import { userModel } from "../models/user.model";
import { CommandType } from "../types/command.type";
import BaseCommand from "./base.command";
import {IUserItem} from "../types/user.type";
import {createEmbedAlert} from "../utils/embed.utils";

export default class BuyCommand extends BaseCommand {

    static command = "comprar";

    static validArgs = ["item"];
    static async run(message: Message, commandRequest: CommandType) {

        let quantity: string | null = commandRequest.args[0];

        if ( quantity && !isNaN(Number(quantity)) && Number(quantity) < 1 ) {
            throw new Error("Debes especificar una cantidad mayor a 0");
        }
        if (quantity && !isNaN(Number(quantity))) {
          commandRequest.args.shift();
        } else {
          quantity = null;
        }

        const itemName = commandRequest.args.join(" ");

        if ( !itemName ) {
            throw new Error("Debes especificar un item");
        }

        const user = await userModel.findOne({ discordId: commandRequest.user.id }).exec();

        if ( !user ) {
            throw new Error("No tienes ningun usuario registrado");
        }

        const itemFound = await itemModel.findOne({ name: itemName }).exec();

        if ( !itemFound ) {
            throw new Error("No se encontro el item");
        }

        if (itemFound.roles.length && !itemFound.roles.some(r => message.member!.roles.cache.has(r))) {
            await message.reply({
              embeds: [ createEmbedAlert("No tienes ninguno de los roles necesarios para comprar este item", Colors.DarkRed )]
            });
            return;
        }

        const itemOnInventory = user.inventory.find(i => i.name === itemFound.name);

        if (itemOnInventory) {
            if (quantity) {
                itemOnInventory.quantity += Number(quantity);
            } else {
                itemOnInventory.quantity++;
            }
        } else {
          user.inventory.push({
              name: itemFound.name,
              quantity: quantity ? Number(quantity) : 1,
              properties: itemFound.properties
          } as IUserItem);
        }


        await user.save();

        await message.reply({ embeds: [ createEmbedAlert(`Has comprado "${itemFound.name}"`) ] });
    
    }

}  