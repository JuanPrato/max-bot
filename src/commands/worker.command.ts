import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {getRandomElementsWithOutRepetition} from "../utils/helpers";
import {createEmbedAlert} from "../utils/embed.utils";

export default class WorkerCommand extends BaseCommand {

    static command = "nueobra";

    static async run (message: Message) {

        const baseText = "Ve hacia (X) y realiza (X) , (X) y (X)";

        const places = ['atrás del casino', 'obra frente casa de Michael', 'alcantarillas', 'edificio frente al maze bank', 'frente al mecánico de paleto', 'atrás de mecánico de sandy', 'muelles', 'consesionario'];

        const arrays: { [key: string]: string[] } = {
            pillars: ['5 pilares', '3 pilares', '7 pilares'],
            walls: ['3 paredes', '5 paredes', '7 paredes'],
            cells: ['2 techos', '5 techos'],
            pipes: ['2 tuberías', '5 tuberías'],
            doors: ['3 puertas', '6 puertas'],
            mixes: ['4 mezclas', '8 mezclas']
        }

        const selectedCategories = getRandomElementsWithOutRepetition(Object.keys(arrays), 3);

        const selectedPlace = getRandomElementsWithOutRepetition(places, 1)[0];
        const selectedThings = selectedCategories.map(category => getRandomElementsWithOutRepetition(arrays[category], 1)[0]);

        await message.reply({
            embeds: [
                createEmbedAlert(
                    baseText
                        .replace('(X)', selectedPlace)
                        .replace('(X)', selectedThings[0])
                        .replace('(X)', selectedThings[1])
                        .replace('(X)', selectedThings[2])
                )
                    .setThumbnail(message.author.avatarURL())
                    .setFooter({ text: "La Barrera RP", iconURL: message.guild!.iconURL()! })
            ]
        })

    }

}