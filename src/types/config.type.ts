import { Document } from "mongoose";

export interface IConfig extends Document {
  guildId: string;
  acceptedRoles: string[];
  billedRoles: string[];
  cureRoles: string[];
  logsChannel: string;
}