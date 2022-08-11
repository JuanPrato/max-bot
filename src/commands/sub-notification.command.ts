import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {reminderModel} from "../models/reminder.model";
import {reminderCache} from "../cache/reminder.cache";
import {createEmbedAlert} from "../utils/embed.utils";

export default class SubNotificationCommand extends BaseCommand {

  static command = "sub";

  static async run (message: Message) {

    const reminder =  await reminderModel.findOne({ discordId: message.author.id }).exec();

    if (reminder) {
      await reminder.delete();
      reminderCache.delete(reminder.discordId);
      await message.reply({
        embeds: [createEmbedAlert("Ya no estas suscrito a las notificaciones")]
      })
    } else {
      const reminderToSave = new reminderModel({ discordId: message.author.id });

      await reminderToSave.save();

      reminderCache.set(reminderToSave.discordId, false);

      await message.reply({
        embeds: [createEmbedAlert("Ya estas suscrito a las notificaciones")]
      });
    }

  }

}