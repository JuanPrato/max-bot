import { Message } from "discord.js";
import { userModel } from "../models/user.model";
import { CommandType } from "../types/command.type";
import BaseCommand from "./base.command";

export default class UseCommand extends BaseCommand {

    static command = "usar";

    static async run(message: Message, commandRequest: CommandType) {
        
        const itemName = commandRequest.args.join(" ");

        const user =  await userModel.findOne({ discordId: commandRequest.user.id }).exec();

        if ( !user ) {
            throw new Error("No tienes ningún usuario registrado");
        }

        const itemFound = user.inventory.find( item => item.name === itemName );

        if ( !itemFound ) {
            throw new Error("No se encontró el item");
        }

        const newInventory = user.inventory.filter( item => item.name !== itemName );
    
        const { food, water, gas, health, service } = user.properties;
        const { food: itemFood, water: itemWater, gas: itemGas, health: itemHealth, service: itemService } = itemFound.properties;

        await user.updateOne({
            $set: {
                inventory: newInventory
            },
            $inc: {
                "properties.food": food + itemFood > 100 ? 100 - food : itemFood,
                "properties.water": water + itemWater > 100 ? 100 - water : itemWater,
                "properties.gas": gas + itemGas > 100 ? 100 - gas : itemGas,
                "properties.health": health + itemHealth > 100 ? 100 - health : itemHealth,
                "properties.service": service + itemService > 100 ? 100 - service : itemService
            }
        }).exec();

        await message.reply(`Has usado ${itemFound.name}`);
    }

}