import {readdirSync} from "fs";
import {join} from "path";
import {CommandType} from "../types/command.type";
import {
  ActionRowBuilder,
  ButtonBuilder, ButtonStyle,
  Colors,
  ComponentType,
  Embed,
  EmbedBuilder, Guild, GuildMember,
  Message,
  MessageOptions, User
} from "discord.js";
import {SEVEN_DAYS_MS, THREE_DAYS_MS, TWO_DAYS_MS} from "./constants";
import {IUser, IUserItem, IUserProperties} from "../types/user.type";
import {IItem, IProperties} from "../types/item.type";
import times from "../cache/times.cache";
import {PropertiesType} from "../types/properties.types";
import {getEmoji, getEnglishProperties, getTranslatedProperty} from "./translate";

export const prod = () => process.env.NODE_ENV === "production";

export const loadEvents = () => readdirSync(join(__dirname, "../events/"))
  .forEach(file => file.endsWith(!prod() ? '.ts' : '.js') && require(`../events/${file}`))

export const loadCaches = () => readdirSync(join(__dirname, "../cache/"))
  .forEach(file => require(`../cache/${file}`));

export const parseCommand = (prefixLength: number,message: Message): CommandType => {

  const messageContent = message.content.slice(prefixLength);
  const messageParts = messageContent.split(" ").filter(part => part !== "");
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

export const calculatePercentages = (user: IUser) => {

  const propertiesNames: PropertiesType[] = getEnglishProperties();
  const percentageProperties: { [k: string]: number } = {};

  for (const p of propertiesNames) {
    percentageProperties[p] = calculatePercentage(user.properties.get(p), p);
  }

  return percentageProperties;

}

export const calculatePercentage = (date0: Date, property: PropertiesType): number => {

  const currentTime = Date.now();
  const endTime = date0.getTime();
  const timeDiff = endTime - currentTime;
  return Math.max(0, Math.round(timeDiff * 100 / times.get(property)!));

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

  const {food: itemFood, water: itemWater, gas: itemGas, health: itemHealth, service: itemService} = item.properties;

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

export const getStatsFromItemArr = (properties: IProperties, names: boolean = true) => {
  const propertiesList = getEnglishProperties();

  return propertiesList.map((p) =>
    (properties[p as keyof IProperties] > 0 ? `${getEmoji(p)} ${names ? getTranslatedProperty(p) : ""} +${properties[p as keyof IProperties]}%` : ""))
    .filter((p) => p !== "");
}

export const getStatsFromItem = (properties: IProperties, names: boolean = true) => {

  const propertiesTexts = getStatsFromItemArr(properties, names);

  return propertiesTexts.length === 0 ? "No tiene propiedades especiales" : propertiesTexts.join("\n\n");

}

export const getInventoryEmbeds = (user: IUser, username: string): EmbedBuilder[] => {

  const embeds: EmbedBuilder[] = [];

  const itemsArray = [];
  let index = 0;

  for (let i = 0; i < user.inventory.length; i += 7) {
    itemsArray.push(user.inventory.slice(i, i + 7));
  }

  for ( const arr of itemsArray) {

    embeds.push(EmbedBuilder.from({
      title: `Inventario de ${username}`,
      fields: arr.map(item => {
        const response = {
          name: `${index} - ${item.name}\nEn propiedad: ${item.quantity}`,
          value: getStatsFromItem(item.properties)
        };
        index++;
        return response;
      }),
      color: Colors.DarkRed,
      thumbnail: {
        //url: message.author.avatarURL()!
        url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.intherabbithole.com%2Fwp-content%2Fupoads%2F2015%2F07%2FVertx-EDC-Gamut-Plus-Bag-Grey-700x1111.jpg&f=1&nofb=1'
      },
    }));
    index++;
  }

  return embeds;
}

export const paginationMessage = async (message: Message, embeds: EmbedBuilder[]): Promise<void> => {

  let row = new ActionRowBuilder<ButtonBuilder>();

  if (embeds.length > 1) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("page-1")
        .setLabel("➡️")
        .setStyle(ButtonStyle.Primary)
    );
  }

  let m = await message.reply({
    embeds: [embeds[0]],
    components: embeds.length > 1 ? [row] : undefined,
  });

  if (embeds.length === 1) return;

  const collector = m.createMessageComponentCollector<ComponentType.Button>({filter: (i) => i.user.id === m.author.id, time: 1000 * 15});

  collector.on("collect", async (i) => {
    console.log(i);
    if (i.message.id !== m.id) return;

    if (i.customId.startsWith("page-")) {

      const nextPage = parseInt(i.customId.split("-")[1]);
      row = new ActionRowBuilder<ButtonBuilder>()
      if (nextPage !== 0) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("page-" + (nextPage - 1))
            .setLabel("⬅️")
            .setStyle(ButtonStyle.Primary)
        );
      }
      if (embeds.length > (nextPage + 1)) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("page-" + (nextPage + 1))
            .setLabel("➡️")
            .setStyle(ButtonStyle.Primary)
        );
      }

      await i.update({
        embeds: [embeds[nextPage]],
        components: [row],
      });
    }
  });

  collector.on("end", async (collected, reason) => {
    if (reason === "time") {
      await m.edit({
        components: []
      });
    }
  });
}

export const dateOn = (minutes: number) => {
  return new Date(new Date().getTime() + minutes * 60 * 1000);
}

export const getMemberByUser = (guild: Guild, user: User): GuildMember => guild.members.cache.get(user.id)!;

export function randomFromArrExcludingIndexes<T>(arr: T[], indexes: number[]): number {
  const randomIndex = Math.floor(Math.random() * arr.length);
  if (indexes.includes(randomIndex)) {
    return randomFromArrExcludingIndexes(arr, indexes);
  }
  return randomIndex;
}

export function getRandomElementsWithOutRepetition<T>(arr: T[], amount: number): T[] {
  // create an array to track the indexes we've used
  const usedIndexes: number[] = [];
  const result: T[] = [];
  for (let i = 0; i < amount; i++) {
    const randomIndex = randomFromArrExcludingIndexes(arr, usedIndexes);
    result.push(arr[randomIndex]);
    usedIndexes.push(randomIndex);
  }
  return result;
}