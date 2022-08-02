import { Document } from "mongoose";
import {IProperties} from "./item.type";

export interface IUserItem extends Document {
  name: string;
  quantity: number;
  properties: IProperties;
}

export interface IUser extends Document {
  discordId: string;
  inventory: IUserItem[];
  properties: IProperties;
}