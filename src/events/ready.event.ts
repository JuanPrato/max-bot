import { Snowflake } from "discord.js";
import { client } from "../bot";
import { userModel } from "../models/user.model";

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;
// const FIVE_MINUTES_IN_MS = 10 * 5;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const getPercentageToRemove = (stat: number, removePercentage: number) => {
  return stat - removePercentage < 0 ? -stat : -removePercentage;
}

client.on("ready", () => {

    const removePercentage3days = Number(((FIVE_MINUTES_IN_MS * 100) / THREE_DAYS_MS).toFixed(2));
    const removePercentage2days = Number(((FIVE_MINUTES_IN_MS * 100) / TWO_DAYS_MS).toFixed(2));
    const removePercentage7days = Number(((FIVE_MINUTES_IN_MS * 100) / SEVEN_DAYS_MS).toFixed(2));
    
    const notifications = new Map<Snowflake, string[]>();

    setInterval( async () => {
        const needNotice = [];
        const users = await userModel.find({}).exec();

        for (const user of users) {

          const { food, water, gas, health, service } = user.properties;

          await user.updateOne({
              $inc: {
                  "properties.food": getPercentageToRemove(food, removePercentage3days),
                  "properties.water": getPercentageToRemove(water, removePercentage2days),
                  "properties.gas": getPercentageToRemove(gas, removePercentage3days),
                  "properties.health": getPercentageToRemove(health, removePercentage7days),
                  "properties.service": getPercentageToRemove(service, removePercentage7days)
              }
          }).exec();
            
        }
    }, FIVE_MINUTES_IN_MS);

});