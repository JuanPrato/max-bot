import { model, Schema } from "mongoose";

export const propertiesSchema = new Schema({
  water: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  food: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  gas: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  health: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  service: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
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