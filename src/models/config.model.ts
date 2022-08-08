import {model, Schema} from "mongoose";
import {IConfig} from "../types/config.type";

const configSchema = new Schema<IConfig>({
  guildId: {
    type: String,
    required: true
  },
  facturationRoles:{
    type: [String],
    required: true,
    default: []
  }
});

export const configModel = model("Config", configSchema);