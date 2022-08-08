import BaseCommand from "../commands/base.command";
import {Message} from "discord.js";
import {getRandomElementsWithOutRepetition} from "../utils/helpers";
import {createEmbedAlert} from "../utils/embed.utils";

export default class TruckDiverCommand extends BaseCommand {

  static command = "inicam";
  static async run(message: Message) {

    const textBase = "Lleva el camión a (u) y cargale (c) , (c) , (c) y descargarlo en (u)";

    const places = [ 'laboratorios humane', 'barrios verdes', 'comisaría paleto', 'aéreopuerto', 'barrios morados', 'barrios amarillos', 'maze bank', 'oxxo central', 'mecánico central', 'rueda de la fortuna de la playa', 'muelles', 'consesionario' ];
    const things = [ 'cajas de vino', 'pales de semillas', 'refacciones de autos', 'electrodomésticos', 'muebles', 'cajas de comida', 'televisores', 'consolas', 'baños', 'camas' ];

    const selectedPlaces = getRandomElementsWithOutRepetition(places, 2);
    const selectedThings = getRandomElementsWithOutRepetition(things, 3);

    await message.reply({
      embeds: [
        createEmbedAlert(
          textBase
            .replace("(u)", selectedPlaces[0])
            .replace("(c)", selectedThings[0])
            .replace("(c)", selectedThings[1])
            .replace("(c)", selectedThings[2])
            .replace("(u)", selectedPlaces[1])
        )]
    })

  }

}