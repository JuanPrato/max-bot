import {Guild, GuildMember, Snowflake, User} from "discord.js";
import { client } from "../bot";
import { userModel } from "../models/user.model";
import {IUser} from "../types/user.type";
import {IProperties} from "../types/item.type";

const INTERVAL_IN_MS = 1000 * 60 * 10;
// const FIVE_MINUTES_IN_MS = 10 * 5;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const removePercentage3days = Number(((INTERVAL_IN_MS * 100) / THREE_DAYS_MS).toFixed(2));
const removePercentage2days = Number(((INTERVAL_IN_MS * 100) / TWO_DAYS_MS).toFixed(2));
const removePercentage7days = Number(((INTERVAL_IN_MS * 100) / SEVEN_DAYS_MS).toFixed(2));


client.on("ready", async () => {

    const notifications = new Map<Snowflake, string[]>();
    let users = await userModel.find({}).exec();
    setInterval( async () => {
        const needNotice: User[] = [];
        const usersToUpdate = [];

        users = await userModel.find({}).exec();

        for (const user of users) {

          const { food, water, gas, health, service } = user.properties;

          const foodToRemove = getPercentageToRemove(food, removePercentage3days);
          const waterToRemove = getPercentageToRemove(water, removePercentage2days);
          const gasToRemove = getPercentageToRemove(gas, removePercentage3days);
          const healthToRemove = getPercentageToRemove(health, removePercentage7days);
          const serviceToRemove = getPercentageToRemove(service, removePercentage7days);

          if (food - foodToRemove < 5 || water - waterToRemove < 5 || gas - gasToRemove < 5 || health - healthToRemove < 5 || service - serviceToRemove < 5) {
            const discordUser = client.users.cache.get(user.discordId)!;

            needNotice.push(discordUser);
          }

          console.log(`${user.discordId} - ${food} - ${water} - ${gas} - ${health} - ${service}`);
          if (foodToRemove < 0 || waterToRemove < 0 || gasToRemove < 0 || healthToRemove < 0 || serviceToRemove < 0) {
            console.log("USER => ", user);
            user.updateOne({
                $inc: {
                    "properties.food": foodToRemove,
                    "properties.water": waterToRemove,
                    "properties.gas": gasToRemove,
                    "properties.health": healthToRemove,
                    "properties.service": serviceToRemove
                }
            });
            usersToUpdate.push(user);
          }
        }

        await userModel.bulkSave(usersToUpdate);

        await notifyOnLowResource(needNotice);

    }, INTERVAL_IN_MS);

    await client.guilds.fetch();
    const usersToCreate: IUser[] = [];
    for (const [, guild] of client.guilds.cache) {
      await guild.members.fetch();
      guild.members.cache.forEach((member) => {
        if (!member.user.bot && !users.some(user => user.discordId === member.id)) {
          const user = new userModel({
            discordId: member.id,
            properties: {
              food: 100,
              water: 100,
              gas: 100,
              health: 100,
              service: 100
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

      dm.send(`Cuidado, tus recursos están bajos. Utiliza el comando -est para ver tu estado.`);

    }

}