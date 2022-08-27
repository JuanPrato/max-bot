import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import profileManager from "../managers/profile.manager";

export default class AddExperienceCommand extends BaseCommand {

    static command = "addxp";
    static adminOnly = true;
    static async run (message: Message, command: CommandType) {

        const mention = message.mentions.members!.first();

        if (!mention) {
            throw new Error("No se ha especificado un usuario");
        }

        const quantity = command.args.pop();

        if (!quantity || isNaN(Number(quantity))) {
            throw new Error("No se ha especificado una cantidad valida de xp");
        }

        const profile = await profileManager.getProfileByDS(mention);

        if (!profile) {
            throw new Error("El usuario no tiene un perfil");
        }

        await profile.updateOne({
            $inc: {
                experience: Number(quantity)
            }
        }).exec();

        await message.reply(`Se ha añadido ${quantity} xp al perfil de ${mention.user.username}`);
    }

}