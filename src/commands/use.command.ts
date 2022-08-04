import { Message } from "discord.js";
import { userModel } from "../models/user.model";
import { CommandType } from "../types/command.type";
import BaseCommand from "./base.command";
import {SEVEN_DAYS_MS, THREE_DAYS_MS, TWO_DAYS_MS} from "../utils/constants";
import {maxPercentageForItem} from "../utils/helpers";

export default class UseCommand extends BaseCommand {

    static command = "usar";

    static validArgs = ["item"];
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

        let newInventory;

        if (itemFound.quantity > 1) {
          itemFound.quantity--;
          newInventory = user.inventory;
        } else {
          newInventory = user.inventory.filter( item => item.name !== itemName );
        }

        const { food, water, gas, health, service } = maxPercentageForItem(user, itemFound);

        await user.updateOne({
            $set: {
                inventory: newInventory,
                "properties.food": new Date(user.properties.food.getTime() + (food / 100) * THREE_DAYS_MS),
                "properties.water": new Date(user.properties.water.getTime() + (water / 100) * TWO_DAYS_MS),
                "properties.gas": new Date(user.properties.gas.getTime() + (gas / 100) * THREE_DAYS_MS),
                "properties.health": new Date(user.properties.health.getTime() + (health / 100) * SEVEN_DAYS_MS),
                "properties.service": new Date(user.properties.service.getTime() + (service / 100) * SEVEN_DAYS_MS)
            }
        }).exec();

        await message.reply(`Has usado ${itemFound.name}`);
    }

}