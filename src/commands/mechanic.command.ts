import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import {getRandomElementsWithOutRepetition, randomFromArrExcludingIndexes} from "../utils/helpers";

export default class MechanicCommand extends BaseCommand {

  static command = "inimec";

  static async run(message: Message) {

    const textBase = "Ve hacia (u) y repara al vehículo (c), (c) y (c)";

    const places = [ 'afuera de base militar', 'barrios verdes', 'barrios morados', 'barrios amarillos', 'maze bank', 'oxxo central', 'carretera en el casino', 'rueda de la fortuna de la playa', 'muelles', 'consesionario' ];
    const things = [ 'motor', 'transmisión', 'cristal', 'pintura', 'foco delantero', 'foco trasero', 'parachoques', 'puerta', 'capo', 'parabrisas', 'carrocería' ];

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