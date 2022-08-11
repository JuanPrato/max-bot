import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import {getRandomElementsWithOutRepetition, randomFromArrExcludingIndexes} from "../utils/helpers";

export default class UberCommand extends BaseCommand {

  static command = "iniuber";

  static async run(message: Message) {

    const textBase = "Ve hacia (u) y recoge a (p) y llévala hasta (u)";

    const places = ['laboratorios humane', 'barrios verdes', 'barrios morados', 'barrios amarillos', 'maze bank', 'oxxo central', 'mecánico central', 'rueda de la fortuna de la playa', 'muelles', 'campo de golf', 'casino', 'aeropuerto', 'Consesionario', 'carcel de sandy', 'aerepuerto de sandy', 'base militar', 'comisaría paleto', 'mecánico paleto'];
    const people = [ 'luis sanchez', 'Alejandro sanz', 'Joaquín guzman', 'Alberto terrazas', 'el jimmy', 'don pancho', 'Alvaro el sonámbulo', 'braulio Leyva', 'Don Chapri' ];

    const selectedPlaces = getRandomElementsWithOutRepetition(places, 2);
    const selectedPeople = getRandomElementsWithOutRepetition(people, 1);

    await message.reply({
      embeds: [
        createEmbedAlert(
          textBase
            .replace("(u)", selectedPlaces[0])
            .replace("(u)", selectedPlaces[1])
            .replace("(p)", selectedPeople[0])
        ).setThumbnail(message.author.avatarURL())
          .setFooter({ text: "La Barrera RP", iconURL: message.guild!.iconURL()! })]
    })

  }

}