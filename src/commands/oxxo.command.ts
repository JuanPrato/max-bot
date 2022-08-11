import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import {getRandomElementsWithOutRepetition, randomFromArrExcludingIndexes} from "../utils/helpers";

export default class OxxoCommand extends BaseCommand {

  static command = "inioxxo";

  static async run(message: Message) {
    const textBase = "lleva la camioneta a (u) y cargale (c) y descargalo en el oxxo";

    const places = [ 'eclipse towers', 'barrios verdes', 'comisaría alcantarillas', 'aéreopuerto', 'barrios morados', 'barrios amarillos', 'maze bank', 'casino', 'mecánico central', 'rueda de la fortuna de la playa', 'muelles', 'campo de golf' ];
    const things = [ 'cajas de alcohol', 'pales de comida', 'hielo', 'cajas de dulces', 'gasolina', 'papel de baño', 'telefonos', 'cajas de bebidas', 'cajas con periódicos', 'cajas de cigarros', 'condones'];

    const selectedPlaces = getRandomElementsWithOutRepetition(places, 1);
    const selectedThings = getRandomElementsWithOutRepetition(things, 1);

    await message.reply({
      embeds: [
        createEmbedAlert(
          textBase
            .replace("(u)", selectedPlaces[0])
            .replace("(c)", selectedThings[0])
        ).setThumbnail(message.author.avatarURL())
          .setFooter({ text: "La Barrera RP", iconURL: message.guild!.iconURL()! })
      ]
    });

  }

}