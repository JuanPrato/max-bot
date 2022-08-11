import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import {getRandomElementsWithOutRepetition} from "../utils/helpers";

export default class GarbageManCommand extends BaseCommand {

  static command = "inibas";

  static async run(message: Message) {

    const textBase = "Ve y recoge la basura en  (u) , (u) , (u) y descarga toda la basura en la sede de los basureros";

    const places = [ 'casino', 'barrios verdes', 'barrios morados', 'barrios amarillos', 'maze bank', 'oxxo central', 'mecánico central', 'rueda de la fortuna de la playa', 'muelles', 'comisaría abierta', 'tienda de máscaras', 'eclipse towers', 'mecánico alcantarillas', 'campo de golf', 'consesionario' ];

    const selectedPlaces = getRandomElementsWithOutRepetition(places, 3);

    await message.reply({
      embeds: [
        createEmbedAlert(
          textBase
            .replace("(u)", selectedPlaces[0])
            .replace("(u)", selectedPlaces[1])
            .replace("(u)", selectedPlaces[2])
        ).setThumbnail(message.author.avatarURL())
          .setFooter({ text: "La Barrera RP", iconURL: message.guild!.iconURL()! })]
    });

  }

}