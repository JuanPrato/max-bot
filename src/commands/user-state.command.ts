import {EmbedBuilder, Message} from "discord.js";
import { userModel } from "../models/user.model";
import {getEmoji, getTranslatedProperty} from "../utils/translate";
import BaseCommand from "./base.command";
import {SEVEN_DAYS_MS, THREE_DAYS_MS, TWO_DAYS_MS} from "../utils/constants";
import {calculatePercentage} from "../utils/helpers";

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

          user = new userModel({
            discordId: message.author.id,
            properties: {
              food: new Date(new Date().getTime() + THREE_DAYS_MS),
              water: new Date(new Date().getTime() + TWO_DAYS_MS),
              gas: new Date(new Date().getTime() + THREE_DAYS_MS),
              health: new Date(new Date().getTime() + SEVEN_DAYS_MS),
              service: new Date(new Date().getTime() + SEVEN_DAYS_MS)
            }
          });


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
                  water: calculatePercentage(user.properties.water, "water"),
                  food: calculatePercentage(user.properties.food, "food"),
                  gas: calculatePercentage(user.properties.gas, "gas"),
                  health: calculatePercentage(user.properties.health, "health"),
                  service: calculatePercentage(user.properties.service, "service")
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