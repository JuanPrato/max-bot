import {client} from "../bot";
import {userModel} from "../models/user.model";
import {IProperties} from "../types/item.type";

client.on("guildMemberAdd", async (member) => {

  await userModel.create({
    discordId: member.id,
    properties: {
      food: 0,
      water: 0,
      gas: 0,
      health: 0,
      service: 0
    } as IProperties
  });

});