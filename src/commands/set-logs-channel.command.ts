import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import configCache from "../cache/config.cache";
import {configModel} from "../models/config.model";
import {createEmbedAlert} from "../utils/embed.utils";
import {webhookCache} from "../cache/webhook.cache";
import {client} from "../bot";

export default class SetLogsChannelCommand extends BaseCommand {

  static command = "set-log-channel";
  static adminOnly = true;
  static async run (message: Message, command: CommandType) {

    const channel = message.mentions.channels.first();

    if (!channel) {
      throw new Error("Please mention a channel");
    }

    let config = configCache.get(message.guild!.id);

    if (!config) {
      config = new configModel({
        guildId: message.guild!.id,
      });
      await config.save();
    }

    config.logsChannel = channel.id;
    await config.save();

    let wb = webhookCache.get(message.guildId!);

    if (!wb) {
      if ("createWebhook" in channel) {
        wb = await channel.createWebhook({
          name: "Logs",
          avatar: client.user!.avatar
        });
        webhookCache.set(message.guildId!, wb);
      }
    } else {
      await wb.edit({
        channel: channel.id
      });
    }


    await message.reply({ embeds: [createEmbedAlert("Logs channel set")] });

  }
}