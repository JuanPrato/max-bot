import {Guild, GuildMember, Snowflake, User} from "discord.js";
import { client } from "../bot";
import { userModel } from "../models/user.model";
import {IUser} from "../types/user.type";
import {IProperties} from "../types/item.type";
import {SEVEN_DAYS_MS, THREE_DAYS_MS, TWO_DAYS_MS} from "../utils/constants";

client.on("ready", async () => {

    let users = await userModel.find().exec();

    await client.guilds.fetch();
    const usersToCreate: IUser[] = [];
    for (const [, guild] of client.guilds.cache) {
      await guild.members.fetch();
      guild.members.cache.forEach((member) => {
        if (!member.user.bot && !users.some(user => user.discordId === member.id)) {
          const user = new userModel({
            discordId: member.id,
            properties: {
              food: new Date(new Date().getTime() + THREE_DAYS_MS),
              water: new Date(new Date().getTime() + TWO_DAYS_MS),
              gas: new Date(new Date().getTime() + THREE_DAYS_MS),
              health: new Date(new Date().getTime() + SEVEN_DAYS_MS),
              service: new Date(new Date().getTime() + SEVEN_DAYS_MS)
            }
          });

          usersToCreate.push(user);
        }
      });
    }

    if ( usersToCreate.length > 0 ) {
      await userModel.bulkSave(usersToCreate);
    }
});

const getPercentageToRemove = (stat: number, removePercentage: number) => {
  return stat - removePercentage < 0 ? -stat : -removePercentage;
}

const notifyOnLowResource = async (usersToNotify: User[]) => {

    for (const user of usersToNotify ) {

      const dm = user.dmChannel;

      if (!dm) continue;

      await dm.send(`Cuidado, tus recursos están bajos. Utiliza el comando -est para ver tu estado.`);

    }

}