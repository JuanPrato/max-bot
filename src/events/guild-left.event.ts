import { client } from "../bot";
import { userModel } from "../models/user.model";
import userManager from "../managers/user.manager";

client.on("guildMemberRemove", async (member) => {

  await userManager.deleteUser(member.guild.id, member.id);

});