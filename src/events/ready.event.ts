import { client } from "../bot";
import { userModel } from "../models/user.model";
import {IDiseases, IUser} from "../types/user.type";
import userManager from "../managers/user.manager";
import {calculatePercentages, createNewProperties} from "../utils/helpers";
import {reminderModel} from "../models/reminder.model";
import {reminderCache} from "../cache/reminder.cache";
import {getDiseases, getTranslatedProperty} from "../utils/translate";
import {profileModel} from "../models/profile.model";
import {IProfile} from "../types/profile.type";
import profileManager from "../managers/profile.manager";
import {configModel} from "../models/config.model";
import {TextChannel} from "discord.js";
import {webhookCache} from "../cache/webhook.cache";
import {get} from "mongoose";

const diseasesAreEqual = (d1: IDiseases, d2: IDiseases) => {

  return getDiseases().every(d => d1[d as keyof IDiseases] === d2[d as keyof IDiseases]);

}
const updateDiseases = (percentages: any, diseases: IDiseases) => {

  if (percentages.water === 0) {
    diseases.dehydration = true;
  }

  if (percentages.food === 0) {
    diseases.malnutrition = true;
  }

  if (percentages.health === 0) {
    diseases.cough = true;
  }

  if (percentages.water === 0 && percentages.food === 0) {
    diseases.dementia = true;

    if (percentages.health === 0) {
      diseases.cancer = true;
    }
  }
  return diseases;
}

client.on("ready", async () => {
    let users = await userManager.getAllUsers();

    await client.guilds.fetch();
    const usersToCreate: IUser[] = [];
    for (const [, guild] of client.guilds.cache) {
      await guild.members.fetch();
      guild.members.cache.forEach((member) => {
        if (!member.user.bot && !users.some(user => user.guildId === member.guild.id && user.discordId === member.id)) {
          const user = new userModel({
            guildId: member.guild.id,
            discordId: member.id,
            properties: createNewProperties()
          });

          usersToCreate.push(user);
        }
      });
    }

    if ( usersToCreate.length > 0 ) {
      await userManager.saveAll(usersToCreate);
    }

    setInterval(async () => {

      users = await userManager.getAllUsers();

      for ( const user of users ) {
        const percentages = calculatePercentages(user);
        const properties = [];
        //console.log(user.discordId, percentages);
        for (const property in percentages) {
          const percentage = percentages[property];

          if (percentage <= 5) {
            properties.push(property);
          }
        }
        await notifyOnLowResource(user, properties);

        const diseases: IDiseases = updateDiseases(percentages,
          {
            cough: user.diseases.cough,
            dehydration: user.diseases.dehydration,
            cancer: user.diseases.cancer,
            dementia: user.diseases.dementia,
            malnutrition: user.diseases.malnutrition
          }
        );
        if (!diseasesAreEqual (user.diseases, diseases)) {
          console.log(user.discordId, diseases);
          await user.updateOne({
            $set: {
              diseases
            }
          }).exec();
        }
      }

    }, 1000 * 60 * 5);

});

const notifyOnLowResource = async (userToNotify: IUser, properties: string[]) => {

  if (!reminderCache.has(userToNotify.discordId) || reminderCache.get(userToNotify.discordId)) return;
  const user = client.users.cache.get(userToNotify.discordId);
  console.log(user);
  if (!user) return;

  await user.send(`Hey ${user.username}, te recuerdo que tienes ${properties.map(getTranslatedProperty).join(', ')} en un porcentaje bajoe. Utiliza el comando -est para ver tu estado.`);

  reminderCache.set(userToNotify.discordId, true);

  await reminderModel.updateOne({
    discordId: user.id
  }, {
    $set: {
      reminded: true
    }
  });

}

client.on("ready", async () => {

  const members: IProfile[] = [];
  const profiles = await profileManager.getAllProfiles();
  for ( const [, guild] of client.guilds.cache) {
    const config = await configModel.findOne({ guildId : guild.id });
    const ms = await guild.members.fetch();
    ms.forEach((member) => {
      if (!member.user.bot &&
        (member.permissions.has("Administrator") || config?.acceptedRoles.some(r => member.roles.cache.has(r))) &&
        !profiles.some(profile => profile.guildId === member.guild.id && profile.discordId === member.id)) {
        members.push(new profileModel({ discordId: member.id, guildId: member.guild.id }));
      }
    });
  }

  await profileManager.createMany(members);

});

client.on("ready", async () => {

    const configs = await configModel.find().exec();
    const guilds = client.guilds.cache;

    for ( const [, guild] of guilds ) {
      let config = configs.find(c => c.guildId === guild.id);
      if (!config) {
        config = await new configModel({
          guildId: guild.id,
          prefix: "-"
        }).save();
      }

      if (!guild.members.cache.get(client.user!.id)?.permissions.has("ManageWebhooks")) return;

      const webhooks = await guild.fetchWebhooks();
      if (!config || !config.logsChannel) continue;

      const channelWebhook = webhooks.find(w => {
        return w.owner!.id === client.user!.id && w.channelId === config?.logsChannel;
      });

      if (!channelWebhook) {
        await guild.channels.fetch(config.logsChannel);
        const channel = guild.channels.cache.get(config.logsChannel);
        if (!channel || !channel.isTextBased()) continue;
        if ("createWebhook" in channel) {
          console.log(channelWebhook);
          try {
            const wb = await channel.createWebhook({
              name: "Logs",
              avatar: client.user!.avatarURL()
            });
            webhookCache.set(guild.id, wb);
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        webhookCache.set(guild.id, channelWebhook);
      }


    }

});