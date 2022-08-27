import {model, Schema} from "mongoose";
import {IPaper, IProfile} from "../types/profile.type";

const paperSchema = new Schema<IPaper>({
    title: {
        type: String,
        required: true
    }
});

const profileSchema = new Schema<IProfile>({
  discordId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    default: 0
  },
  checks: {
    type: Number,
    default: 0
  },
  billed: {
    type: Number,
    default: 0
  },
  papers: {
    type: [paperSchema],
    default: []
  }
});

export const profileModel = model("Profile", profileSchema);