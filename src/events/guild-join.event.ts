import {client} from "../bot";
import userManager from "../managers/user.manager";

client.on("guildMemberAdd", async (member) => {

  await userManager.createEmptyUser(member.id);

});