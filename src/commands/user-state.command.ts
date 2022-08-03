import {EmbedBuilder, Message} from "discord.js";
import { userModel } from "../models/user.model";
import {getEmoji, getTranslatedProperty} from "../utils/translate";
import BaseCommand from "./base.command";

const createFields = (properties: any): {name: string, value: string}[] => {
    
    const keys = Object.keys(properties);

    const fields: any[] = [];

    for ( const key of keys ) {

        const totalBars = Math.floor(properties[key] / 5);
        const barsString = Array.from({ length: 20 }).reduce((acc, i, index) => acc + (index >= totalBars ? " " : "█"), "");

        fields.push({
            name: getTranslatedProperty(key),
            value: `\`${barsString}\` ${getEmoji(key)} ${properties[key]}%`
        });
    }

    return fields;
}

export default class UserStateCommand extends BaseCommand {

    static command = "est";

    static async run(message: Message, ) {
        
        let user = await userModel.findOne({ discordId: message.author.id }).exec();

        if ( !user ) {
            //throw new Error("No tienes ningún usuario registrado");

            user = new userModel({ discordId: message.author.id, properties: {
                food: 100,
                water: 100,
                gas: 100,
                health: 100,
                service: 100
              }});

            await user.save();
        }

        await message.reply({
            embeds: [EmbedBuilder.from({
              title: `Estado de ${message.author.username}`,
              thumbnail: {
                url: message.author.avatarURL()!
              },
              fields: createFields(
                {
                  water: Math.round(user.properties.water),
                  food: Math.round(user.properties.food),
                  gas: Math.round(user.properties.gas),
                  health: Math.round(user.properties.health),
                  service: Math.round(user.properties.service)
                }),
              color: 0x00ff00,
              timestamp: new Date().toISOString(),
              footer: {
                text: "Estado de usuario"
              }
              })]
        });
        
        }

}