import {model, Schema} from "mongoose";

const reminderSchema = new Schema({
  discordId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  reminded: {
    type: Boolean,
    default: false
  }
});

export const reminderModel = model("Reminder", reminderSchema);