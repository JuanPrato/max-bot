import {EmbedBuilder, Message} from "discord.js";
import {getDisease, getDiseases, getEmoji, getTranslatedProperty} from "../utils/translate";
import BaseCommand from "./base.command";
import {calculatePercentages} from "../utils/helpers";
import userManager from "../managers/user.manager";
import {IDiseases, IUser} from "../types/user.type";

function getDiseasesDescription(deseases: IDiseases) {

  const diseasesArr = getDiseases();
  const diseases = diseasesArr.filter(disease => deseases[disease as keyof IDiseases]);
  if (diseases.length === 0) {
    return "No tiene enfermedades";
  }
  return diseases.map((d) => `- ${getDisease(d)}`).join("\n");

}

const createFields = (user: IUser, properties: any): { name: string, value: string }[] => {

  const keys = Object.keys(properties);

  const fields: any[] = [];

  for (const key of keys) {

    const totalBars = Math.floor(properties[key] / 5);
    const barsString = Array.from({length: 20}).reduce((acc, i, index) => acc + (index >= totalBars ? " " : "█"), "");

    fields.push({
      name: getTranslatedProperty(key),
      value: `\`${barsString}\` ${getEmoji(key)} ${properties[key]}%`
    });
  }

  fields.push({
    name: "Enfermedades",
    value: getDiseasesDescription(user.diseases)
  })

  return fields;
}

export default class UserStateCommand extends BaseCommand {

  static command = "est";

  static async run(message: Message,) {

    const mention = message.mentions.members?.first();
    const dsUser = mention ? mention : message.member;

    const user = await userManager.getUserWithDSMember(dsUser);

    if (!user) {
      throw new Error("No tienes ningún usuario registrado");
    }

    await message.reply({
      embeds: [EmbedBuilder.from({
        title: `Estado de ${message.author.username}`,
        thumbnail: {
          url: message.author.avatarURL()!
        },
        fields: createFields(user, calculatePercentages(user)),
        color: 0x00ff00,
        timestamp: new Date().toISOString(),
        footer: {
          text: "Estado de usuario"
        }
      })]
    });

  }

}