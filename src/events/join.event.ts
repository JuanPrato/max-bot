import {client} from "../bot";
import {IProfile} from "../types/profile.type";
import {profileModel} from "../models/profile.model";
import profileManager from "../managers/profile.manager";

client.on("guildCreate", async (guild) => {

  const admins = guild.members.cache.filter(member => member.permissions.has("Administrator"));

  const userToCreate: IProfile[] = [];

  for (const [id,] of admins) {

    userToCreate.push(new profileModel({
      discordId: id,
      guildId: guild.id
    }));

  }

  await profileManager.saveMany(userToCreate);

});