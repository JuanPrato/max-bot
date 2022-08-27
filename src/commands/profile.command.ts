import BaseCommand from "./base.command";
import {Colors, EmbedBuilder, Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import profileManager from "../managers/profile.manager";
import {getMemberByUser} from "../utils/helpers";

export default class ProfileCommand extends BaseCommand {

  static command = "pda";
  static description = "Muestra el perfil de un usuario";
  static validArgs = ["?@user"];

  static async run(message: Message) {

    const mention = message.mentions.members!.first() || message.member!;

    let profile = await profileManager.getProfileByDS(mention);

    if (!profile) {
      profile = await profileManager.createWithMember(mention);
    }

    await message.reply({
      embeds: [
        EmbedBuilder.from({
          title: `Perfil de ${mention.user.username}`,
          color: Colors.DarkRed,
          fields: [
            {
              name: "🆙 Experiencia",
              value: `${profile.experience} xp`,
            },
            {
              name: "💰 Cheques",
              value: `$${profile.checks}`
            },
            {
              name: "🧾 Facturado",
              value: `$${profile.billed}`
            },
            {
              name: "📋 Papeles",
              value: !!profile.papers.length ? profile.papers.map((p, index) => `${index} - ${p.title}`).join("\n") : "No tienes papeles"
            }
          ]
        })
      ]
    });

  }

}