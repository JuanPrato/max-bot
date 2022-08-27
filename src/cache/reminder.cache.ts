import {reminderModel} from "../models/reminder.model";

type Reminder = {
  reminderDate: Date;
  reminderMessage: string;
}

export const reminderCache = new Map<string, boolean>();

async function loadCache() {

  const reminders = await reminderModel.find().exec();

  for (const reminder of reminders) {
    reminderCache.set(`${reminder.discordId}${reminder.guildId}`, reminder.reminded);
  }

}

loadCache();