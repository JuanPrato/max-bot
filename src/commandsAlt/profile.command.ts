import BaseCommand from "../commands/base.command";
import {Colors, EmbedBuilder, Message} from "discord.js";
import {createEmbedAlert} from "../utils/embed.utils";
import profileManager from "../managers/profile.manager";
import {getMemberByUser} from "../utils/helpers";

export default class ProfileCommand extends BaseCommand {

  static command = "pda";
  static description = "Muestra el perfil de un usuario";
  static validArgs = ["?@user"];

  static async run(message: Message) {

    const mention = message.mentions.users.first();
    const user = mention ? getMemberByUser(message.guild!, mention) : message.member;

    const profile = await profileManager.getProfileByDS(user);

    if (!profile) {
      await message.reply({ embeds: [createEmbedAlert("No tienes un perfil")] });
      return;
    }

    await message.reply({
      embeds: [
        EmbedBuilder.from({
          title: `Perfil de ${user?.user.username}`,
          color: Colors.Green,
          fields: [
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