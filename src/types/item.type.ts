import { Document } from "mongoose";

export interface IProperties extends Document {
  water: number;
  food: number;
  gas: number;
  health: number;
  service: number
}
export interface IItem extends Document {
  name: string;
  roles: string[];
  properties: IProperties;
}
