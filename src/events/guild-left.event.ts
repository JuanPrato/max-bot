import { client } from "../bot";
import { userModel } from "../models/user.model";

client.on("guildMemberRemove", async (member) => {

  await userModel.deleteOne({discordId: member.id});

});