import {IUser} from "../types/user.type";
import {userModel} from "../models/user.model";
import {GuildMember, User} from "discord.js";
import {createNewProperties} from "../utils/helpers";

class UserManager {

  getAllUsers(): Promise<IUser[]> {
    return userModel.find({}).exec();
  }

  async getUserWithDSMember(user: GuildMember | null): Promise<IUser | null> {
    if (!user) return null;
    return userModel.findOne({ guildId: user.guild.id, discordId: user.id }).exec();
  }

  getUserWithDiscordId(discordId: string): Promise<IUser | null> {
    return userModel.findOne({ discordId: discordId }).exec();
  }

  createEmptyUser(discordId: string, guildId: string): Promise<IUser> {
    const user = new userModel({
      guildId: guildId,
      discordId: discordId,
      inventory: [],
      properties: createNewProperties()
    });
    return user.save();
  }

  async saveAll(users: IUser[]): Promise<boolean> {
    const result = await userModel.bulkSave(users);
    return result.getWriteErrors().length === 0;
  }

  deleteUser(guildId: string, discordId: string): Promise<IUser | null> {
    return userModel.findOneAndDelete({ guildId: guildId, discordId: discordId }).exec();
  }

  resetUser(user: IUser): Promise<IUser | null> {
    return user.updateOne({
      $set: {
        properties: createNewProperties(),
        diseases: {}
      }
    })
    .exec();
  }

}

export default new UserManager();