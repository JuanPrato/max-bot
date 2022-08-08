import BaseCommand from "../commands/base.command";
import {Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import {getRandomElementsWithOutRepetition, randomFromArrExcludingIndexes} from "../utils/helpers";

export default class FireManCommand extends BaseCommand {

  static command = "inibom";

  static async run(message: Message) {

    const textBase = "Ve hacia (u) y apaga  (c) , (c) y (c) del fuego";

    const places = [ 'laboratorios humane', 'barrios verdes', 'barrios morados', 'barrios amarillos', 'maze bank', 'oxxo central', 'mecánico central', 'rueda de la fortuna de la playa', 'muelles', 'consesionario'];
    const things = [ 'sedan', 'camioneta', 'almacén', 'moto', 'pila de cajas', 'colchón', 'auto pequeño', 'pared', 'persona', 'pila de basura' ];

    const selectedPlaces = getRandomElementsWithOutRepetition(places, 1);
    const selectedThings = getRandomElementsWithOutRepetition(things, 3);

    await message.reply({
      embeds: [
        createEmbedAlert(
          textBase
            .replace("(u)", selectedPlaces[0])
            .replace("(c)", selectedThings[0])
            .replace("(c)", selectedThings[1])
            .replace("(c)", selectedThings[2])
        )]
    })

  }

}