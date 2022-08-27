import { Document } from "mongoose";

export interface IPaper extends Document {
  title: string;
}

export interface IProfile extends Document {
  discordId: string;
  guildId: string;
  experience: number;
  checks: number;
  billed: number;
  papers: IPaper[];
}