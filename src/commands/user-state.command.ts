import { Message } from "discord.js";
import { userModel } from "../models/user.model";
import { getTranslatedProperty } from "../utils/helpers";
import BaseCommand from "./base.command";

const createFields = (properties: any): {name: string, value: string}[] => {
    
    const keys = Object.keys(properties);

    const fields: any[] = [];

    for ( const key of keys ) {
        fields.push({
            name: getTranslatedProperty(key),
            value: `\`████████████████████\` ${properties[key]}%`
        });
    }

    return fields;
}

export default class UserStateCommand extends BaseCommand {

    static command = "est";

    static async run(message: Message, ) {
        
        const user = await userModel.findOne({ discordId: message.author.id }).exec();

        if ( !user ) {
            throw new Error("No tienes ningun usuario registrado");
        }


        await message.reply({
            embeds: [{
            fields: createFields({water: user.properties.water, food: user.properties.food, gas: user.properties.gas, health: user.properties.health, service: user.properties.service}),
            }]
        });
        
        }

}