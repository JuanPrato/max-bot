import { model, Schema } from "mongoose";
import { propertiesSchema } from "./item.model";
import {IUser, IUserItem} from "../types/user.type";

const userItemSchema = new Schema<IUserItem>({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  properties: {
    type: propertiesSchema,
    required: true,
    default: {}
  }
});

const userSchema = new Schema<IUser>({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  inventory: [ userItemSchema ],
  properties: {
    type: propertiesSchema,
    default: {}
  }
}, {
  timestamps: true
});

export const userModel = model("User", userSchema);