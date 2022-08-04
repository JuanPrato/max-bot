import {client} from "../bot";
import {userModel} from "../models/user.model";
import {createNewProperties} from "../utils/helpers";

client.on("guildMemberAdd", async (member) => {

  await userModel.create({
    discordId: member.id,
    properties: createNewProperties()
  });

});