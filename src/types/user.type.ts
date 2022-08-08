import { Document } from "mongoose";
import {IProperties} from "./item.type";

export interface IDiseases {
  dehydration: boolean;
  malnutrition: boolean;
  cough: boolean;
  dementia: boolean;
  cancer: boolean;
}

export interface IUserItem extends Document {
  name: string;
  quantity: number;
  properties: IProperties;
}

export interface IUserProperties extends Document {
  water: Date;
  food: Date;
  gas: Date;
  health: Date;
  service: Date;
}

export interface IUser extends Document {
  discordId: string;
  inventory: IUserItem[];
  properties: IUserProperties;
  diseases: IDiseases;
}