import { Document } from "mongoose";

export interface IConfig extends Document {
  guildId: string;
  billedRoles: string[];
  cureRoles: string[];
  logsChannel: string;
}