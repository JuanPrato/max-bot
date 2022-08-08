import { Document } from "mongoose";

export interface IConfig extends Document {
  guildId: string;
  facturationRoles: string[];
}