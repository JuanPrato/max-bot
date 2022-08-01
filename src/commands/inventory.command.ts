import { Message } from "discord.js";
import { userModel } from "../models/user.model";
import { CommandType } from "../types/command.type";
import BaseCommand from "./base.command";

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

        const inventoryMessage = inventory.map( item => `${item.name} - ${item.quantity}` ).join("\n");

        await message.reply(inventoryMessage);

    }

}