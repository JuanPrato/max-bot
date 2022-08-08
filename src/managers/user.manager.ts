import {IUser} from "../types/user.type";
import {userModel} from "../models/user.model";
import {GuildMember, User} from "discord.js";
import {createNewProperties} from "../utils/helpers";

class UserManager {

  getAllUsers(): Promise<IUser[]> {
    return userModel.find({}).exec();
  }

  async getUserWithDSMemberOrUser(user: GuildMember | User | null): Promise<IUser | null> {
    if (!user) return null;
    return userModel.findOne({ discordId: user.id }).exec();
  }

  getUserWithDiscordId(discordId: string): Promise<IUser | null> {
    return userModel.findOne({ discordId: discordId }).exec();
  }

  createEmptyUser(discordId: string): Promise<IUser> {
    const user = new userModel({
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

  deleteUser(discordId: string): Promise<IUser | null> {
    return userModel.findOneAndDelete({ discordId: discordId }).exec();
  }

}

export default new UserManager();