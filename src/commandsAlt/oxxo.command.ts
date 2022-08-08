import BaseCommand from "../commands/base.command";
import {Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import {getRandomElementsWithOutRepetition, randomFromArrExcludingIndexes} from "../utils/helpers";

export default class OxxoCommand extends BaseCommand {

  static command = "inioxxo";

  static async run(message: Message) {
    const textBase = "Lleva el camión a (u) y cargale (c) , (c) , (c) y descargarlo en (u)";

    const places = [ 'eclipse towers', 'barrios verdes', 'comisaría alcantarillas', 'aéreopuerto', 'barrios morados', 'barrios amarillos', 'maze bank', 'casino', 'mecánico central', 'rueda de la fortuna de la playa', 'muelles', 'campo de golf' ];
    const things = [ 'cajas de alcohol', 'pales de comida', 'hielo', 'cajas de dulces', 'gasolina', 'papel de baño', 'telefonos', 'cajas de bebidas', 'cajas con periódicos', 'cajas de cigarros', 'condones'];

    const selectedPlaces = getRandomElementsWithOutRepetition(places, 2);
    const selectedThings = getRandomElementsWithOutRepetition(things, 3);

    await message.reply({
      embeds: [
        createEmbedAlert(
          textBase
            .replace("(u)", selectedPlaces[0])
            .replace("(u)", selectedPlaces[1])
            .replace("(c)", selectedThings[0])
            .replace("(c)", selectedThings[1])
            .replace("(c)", selectedThings[2])
        )
      ]
    });

  }

}