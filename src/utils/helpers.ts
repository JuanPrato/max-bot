import { readdirSync } from "fs";
import { join } from "path";
import {CommandType} from "../types/command.type";
import {Colors, EmbedBuilder, Message} from "discord.js";
import {SEVEN_DAYS_MS, THREE_DAYS_MS, TWO_DAYS_MS} from "./constants";
import {IUser, IUserItem} from "../types/user.type";
import {IItem, IProperties} from "../types/item.type";
import times from "../cache/times.cache";
import {PropertiesType} from "../types/properties.types";
import {getEmoji, getEnglishProperties, getTranslatedProperty} from "./translate";

export const prod = () => process.env.NODE_ENV === "production";

export const loadEvents = () => readdirSync(join(__dirname, "../events/"))
  .forEach(file => file.endsWith(!prod() ? '.ts' : '.js') && require(`../events/${file}`))

export const loadCaches = () => readdirSync(join(__dirname, "../cache/"))
  .forEach(file => require(`../cache/${file}`));

export const parseCommand = (message: Message): CommandType => {

  const messageContent = message.content.slice(1);
  const messageParts = messageContent.split(" ");
  const commandName = messageParts.shift();

  if (!commandName) {
    throw new Error("Invalid command");
  }

  return {
    name: commandName,
    args: messageParts,
    user: message.author
  };
}

export const calculatePercentage = (date0: Date, property: PropertiesType): number => {

  const currentTime = Date.now();
  const endTime = date0.getTime();
  const timeDiff = endTime - currentTime;
  return Math.round(timeDiff * 100 / times.get(property)!);

}

export const createNewProperties = () => {
  return {
    food: new Date(new Date().getTime() + THREE_DAYS_MS),
    water: new Date(new Date().getTime() + TWO_DAYS_MS),
    gas: new Date(new Date().getTime() + THREE_DAYS_MS),
    health: new Date(new Date().getTime() + SEVEN_DAYS_MS),
    service: new Date(new Date().getTime() + SEVEN_DAYS_MS)
  }
}

export const maxPercentageForItem = (user: IUser, item: IItem | IUserItem) => {

  const { food: itemFood, water: itemWater, gas: itemGas, health: itemHealth, service: itemService } = item.properties;

  const foodPercentage = calculatePercentage(user.properties.food, "food");
  const waterPercentage = calculatePercentage(user.properties.water, "water");
  const gasPercentage = calculatePercentage(user.properties.gas, "gas");
  const healthPercentage = calculatePercentage(user.properties.health, "health");
  const servicePercentage = calculatePercentage(user.properties.service, "service");

  const maxFood = Math.min(100 - foodPercentage, itemFood);
  const maxWater = Math.min(100 - waterPercentage, itemWater);
  const maxGas = Math.min(100 - gasPercentage, itemGas);
  const maxHealth = Math.min(100 - healthPercentage, itemHealth);
  const maxService = Math.min(100 - servicePercentage, itemService);

  return {
    food: maxFood,
    water: maxWater,
    gas: maxGas,
    health: maxHealth,
    service: maxService
  }

}

export const getStatsFromItem = (properties: IProperties, names: boolean = true) => {
  const propertiesList = getEnglishProperties();

  return propertiesList.map((p) =>
    (properties[p as keyof IProperties] > 0 ? `${getEmoji(p)} ${names ? getTranslatedProperty(p) : ""} +${properties[p as keyof IProperties]}%` : ""))
    .filter((p) => p !== "");
}

export const getInventoryEmbed = (user: IUser, username: string) => EmbedBuilder.from({
            title: `Inventario de ${username}`,
            fields: user.inventory.map( item => ({ name: `${item.name}\nEn propiedad: ${item.quantity}`, value: getStatsFromItem(item.properties).join("\n\n") })),
            color: Colors.Green,
            thumbnail: {
              //url: message.author.avatarURL()!
              url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.intherabbithole.com%2Fwp-content%2Fuploads%2F2015%2F07%2FVertx-EDC-Gamut-Plus-Bag-Grey-700x1111.jpg&f=1&nofb=1'
            },
          })