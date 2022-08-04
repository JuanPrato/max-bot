import { Message } from "discord.js";
import { userModel } from "../models/user.model";
import { CommandType } from "../types/command.type";
import BaseCommand from "./base.command";
import {getInventoryEmbed} from "../utils/helpers";

export default class AdminCommand extends BaseCommand {

    static command = "admin";
    static validArgs = ["acción", "@usuario", "item?"];
    static adminOnly = true;
    static async run(message: Message, commandRequest: CommandType) {

        if ( !message.member!.permissions.has("Administrator") ) return;

        const action = commandRequest.args[0];
        const selectedUser = message.mentions.members?.first();

        if (!selectedUser) {
            throw new Error("Debes especificar un usuario");
        }

        if (!action) {
            throw new Error("Debes especificar una acción");
        }

        const user = await userModel.findOne({ discordId: selectedUser.id }).exec();

        if (!user) {
            throw new Error("El usuario mencionado no tiene ningún usuario registrado");
        }

        switch (action) {
            case "inventario":
              await message.reply({
                embeds: [getInventoryEmbed(user, selectedUser.user.username)]
              })
              break;

            case "agregar":
                const itemQuantity = commandRequest.args.pop();
                const itemName = commandRequest.args.join(" ");
                
                if (!itemName || !itemQuantity) {
                    throw new Error("Debes especificar un item y su cantidad");
                }
                // TODO: Preguntar si el item tiene que existir en la tienda
                await user.updateOne({
                    inventory: [...user.inventory, { name: itemName, quantity: Number(itemQuantity) } ]
                })
                break;

            case "remover":
                const itemNameToRemove = commandRequest.args.slice(2).join(" ");

                if (!itemNameToRemove) {
                    throw new Error("Debes especificar un item");
                }

                const newInventory = user.inventory.filter(item => item.name !== itemNameToRemove);

                await user.updateOne({
                    inventory: newInventory
                }).exec();

                await message.reply(`Has removido ${itemNameToRemove} del inventario de ${selectedUser.user.username}`);
                break;
            default:
                throw new Error("Acción no reconocida");
        }

    }

}