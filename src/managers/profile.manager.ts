import {profileModel} from "../models/profile.model";
import {GuildMember} from "discord.js";
import {IProfile} from "../types/profile.type";

class ProfileManager {

  async getAllProfiles(): Promise<IProfile[]> {
    return profileModel.find({}).exec();
  }

  async getProfileByDS(user: GuildMember | null): Promise<IProfile | null> {
    if (!user) return null;
    return profileModel.findOne({ discordId: user.id, guildId: user.guild.id }).exec();
  }

  async createMany(profiles: IProfile[]): Promise<boolean> {
    try {
      await profileModel.insertMany(profiles);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  async createWithMember (user: GuildMember): Promise<IProfile> {
    const profile = new profileModel({
      guildId: user.guild.id,
      discordId: user.id,
      billed: 0
    });
    await profile.save();
    return profile;
  }

}

export default new ProfileManager();