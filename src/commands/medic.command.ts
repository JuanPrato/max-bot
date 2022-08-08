import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {getRandomElementsWithOutRepetition} from "../utils/helpers";
import {createEmbedAlert} from "../utils/embed.utils";

export default class MedicCommand extends BaseCommand {

  static command = "inimed";

  static async run(message: Message) {

    const textBase = "Ve hacia (u) y recoge a la persona y llévala al hospital más cercano y curale (c) , (c) y (c)";

    const places = [ 'laboratorios humane', 'barrios verdes', 'barrios morados', 'barrios amarillos', 'maze bank', 'oxxo central', 'mecánico central', 'rueda de la fortuna de la playa', 'muelles', 'casino', 'consesionario' ];
    const parts = [ 'pierna rota', 'brazo roto', 'bala en el pecho', 'bala en la pierna', 'cortadura en la mano', 'herida en la cabeza', 'cuello lastimado', 'bala en el estómago', 'dedo roto', 'pie roto' ];

    const selectedPlaces = getRandomElementsWithOutRepetition(places, 1);
    const selectedParts = getRandomElementsWithOutRepetition(parts, 3);

    await message.reply({
      embeds: [
        createEmbedAlert(
          textBase
            .replace("(u)", selectedPlaces[0])
            .replace("(c)", selectedParts[0])
            .replace("(c)", selectedParts[1])
            .replace("(c)", selectedParts[2])
        )
      ]
    });

  }

}