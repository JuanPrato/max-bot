import { model, Schema } from "mongoose";
import { propertiesSchema } from "./item.model";

const userItemSchema = new Schema({
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

const userSchema = new Schema({
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