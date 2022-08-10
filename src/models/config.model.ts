import {model, Schema} from "mongoose";
import {IConfig} from "../types/config.type";

const configSchema = new Schema<IConfig>({
  guildId: {
    type: String,
    required: true
  },
  acceptedRoles: {
    type: [String],
    required: true,
    default: []
  },
  billedRoles:{
    type: [String],
    required: true,
    default: []
  },
  cureRoles: {
    type: [String],
    required: true,
    default: []
  },
  logsChannel: {
    type: String
  }
});

export const configModel = model("Config", configSchema);