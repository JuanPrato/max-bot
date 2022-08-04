import { model, Schema } from "mongoose";
import { propertiesSchema as itemPropertiesSchema } from "./item.model";
import {IUser, IUserItem, IUserProperties} from "../types/user.type";

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
    type: itemPropertiesSchema,
    required: true,
    default: {}
  }
});


export const propertiesSchema = new Schema<IUserProperties>({
  water: {
    type: Date,
    default: new Date(),
  },
  food: {
    type: Date,
    default: new Date(),

  },
  gas: {
    type: Date,
    default: new Date(),

  },
  health: {
    type: Date,
    default: new Date(),
  },
  service: {
    type: Date,
    default: new Date(),
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