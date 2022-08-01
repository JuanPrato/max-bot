import { Message } from "discord.js";
import { itemModel } from "../models/item.model";
import { userModel } from "../models/user.model";
import { CommandType } from "../types/command.type";
import BaseCommand from "./base.command";

export default class BuyCommand extends BaseCommand {

    static command = "comprar";

    static async run(message: Message, commandRequest: CommandType) {
        
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

        user.inventory.push({
            name: itemFound.name,
            quantity: 1,
            properties: itemFound.properties
        });

        await user.save();

        await message.reply(`Has comprado ${itemFound.name}`);
    
    }

}  