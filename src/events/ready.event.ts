import { Snowflake } from "discord.js";
import { client } from "../bot";
import { userModel } from "../models/user.model";

const INTERVAL_IN_MS = 1000 * 60 * 10;
// const FIVE_MINUTES_IN_MS = 10 * 5;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const getPercentageToRemove = (stat: number, removePercentage: number) => {
  return stat - removePercentage < 0 ? -stat : -removePercentage;
}

client.on("ready", () => {

    const removePercentage3days = Number(((INTERVAL_IN_MS * 100) / THREE_DAYS_MS).toFixed(2));
    const removePercentage2days = Number(((INTERVAL_IN_MS * 100) / TWO_DAYS_MS).toFixed(2));
    const removePercentage7days = Number(((INTERVAL_IN_MS * 100) / SEVEN_DAYS_MS).toFixed(2));
    
    const notifications = new Map<Snowflake, string[]>();

    setInterval( async () => {
        const needNotice = [];
        const users = await userModel.find({}).exec();
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

});