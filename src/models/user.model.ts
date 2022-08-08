import { model, Schema } from "mongoose";
import { propertiesSchema as itemPropertiesSchema } from "./item.model";
import {IDiseases, IUser, IUserItem, IUserProperties} from "../types/user.type";

const diseasesSchema = new Schema<IDiseases>({
  dehydration: {
    type: Boolean,
    default: false
  },
  malnutrition: {
    type: Boolean,
    default: false
  },
  cough: {
    type: Boolean,
    default: false
  },
  dementia: {
    type: Boolean,
    default: false
  },
  cancer: {
    type: Boolean,
    default: false
  }
});

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
  guildId: {
    type: String,
  },
  discordId: {
    type: String,
    required: true,
  },
  inventory: [ userItemSchema ],
  properties: {
    type: propertiesSchema,
    default: {}
  },
  diseases: {
    type: diseasesSchema,
    required: true,
    default: {}
  }
}, {
  timestamps: true
});

export const userModel = model("User", userSchema);