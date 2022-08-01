import { model, Schema } from "mongoose";

export const propertiesSchema = new Schema({
  water: {
    type: Number,
    default: 0
  },
  food: {
    type: Number,
    default: 0
  },
  gas: {
    type: Number,
    default: 0
  },
  health: {
    type: Number,
    default: 0
  },
  service: {
    type: Number,
    default: 0
  }
});

export const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  roles: {
    type: [String],
    required: true,
    default: []
  },
  properties: {
    type: propertiesSchema,
    required: true,
    default: {}
  }
}, {
  timestamps: true
});

export const itemModel = model("Item", itemSchema);