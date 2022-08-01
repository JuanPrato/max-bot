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

        // TODO: Implementar el uso de items
        await user.updateOne({
            inventory: newInventory
        });

        await message.reply(`Has usado ${itemFound.name}`);
    }

}