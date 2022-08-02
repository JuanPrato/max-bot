import { Snowflake } from "discord.js";
import { client } from "../bot";
import { userModel } from "../models/user.model";
import {IUser} from "../types/user.type";
import {IProperties} from "../types/item.type";

const INTERVAL_IN_MS = 1000 * 60 * 10;
// const FIVE_MINUTES_IN_MS = 10 * 5;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const getPercentageToRemove = (stat: number, removePercentage: number) => {
  return stat - removePercentage < 0 ? -stat : -removePercentage;
}

client.on("ready", async () => {

    const removePercentage3days = Number(((INTERVAL_IN_MS * 100) / THREE_DAYS_MS).toFixed(2));
    const removePercentage2days = Number(((INTERVAL_IN_MS * 100) / TWO_DAYS_MS).toFixed(2));
    const removePercentage7days = Number(((INTERVAL_IN_MS * 100) / SEVEN_DAYS_MS).toFixed(2));
    
    const notifications = new Map<Snowflake, string[]>();
    const users = await userModel.find({}).exec();

    setInterval( async () => {
        const needNotice = [];
        const usersToUpdate = [];

        for (const user of users) {

          const { food, water, gas, health, service } = user.properties;

          const foodToRemove = getPercentageToRemove(food, removePercentage3days);
          const waterToRemove = getPercentageToRemove(water, removePercentage2days);
          const gasToRemove = getPercentageToRemove(gas, removePercentage3days);
          const healthToRemove = getPercentageToRemove(health, removePercentage7days);
          const serviceToRemove = getPercentageToRemove(service, removePercentage7days);

          if (foodToRemove > 0 || waterToRemove > 0 || gasToRemove > 0 || healthToRemove > 0 || serviceToRemove > 0) {
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
    }, INTERVAL_IN_MS);

    await client.guilds.fetch();
    const usersToCreate: IUser[] = [];
    client.guilds.cache.forEach((guild) => {
      guild.members.cache.forEach((member) => {
        if (!users.some(user => user.discordId === member.id)) {
          usersToCreate.push({
            discordId: member.id,
            properties: {
              food: 0,
              water: 0,
              gas: 0,
              health: 0,
              service: 0
            } as IProperties
          } as IUser);
        }
      });
    });

    await userModel.bulkSave(usersToCreate);
});