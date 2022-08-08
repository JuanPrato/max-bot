import {webhookCache} from "../cache/webhook.cache";
import {createEmbedAlert} from "../utils/embed.utils";
import {Colors, EmbedBuilder} from "discord.js";

class WebhookManager {

  async sendLog(guildId: string, action: string, author: string) {

    const wb = webhookCache.get(guildId);

    if (!wb) return;

    await wb.send({
      embeds: [EmbedBuilder.from({
      title: "Log",
      description: action,
      fields: [
        {
          name: "Autor",
          value: `<@${author}>`
        }
      ],
      color: Colors.Yellow,
      timestamp: new Date().toISOString()
     })]
    });

  }

}

export default new WebhookManager();