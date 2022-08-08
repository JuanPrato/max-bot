import { client } from "../bot";
import { userModel } from "../models/user.model";
import {IDiseases, IUser} from "../types/user.type";
import {SEVEN_DAYS_MS, THREE_DAYS_MS, TWO_DAYS_MS} from "../utils/constants";
import userManager from "../managers/user.manager";
import {calculatePercentages} from "../utils/helpers";
import {reminderModel} from "../models/reminder.model";
import {reminderCache} from "../cache/reminder.cache";
import {getDiseases, getTranslatedProperty} from "../utils/translate";
import {profileModel} from "../models/profile.model";
import {IProfile} from "../types/profile.type";
import profileManager from "../managers/profile.manager";

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
    const ms = await guild.members.fetch();
    ms.forEach((member) => {
      if (!member.user.bot && !profiles.some(profile => profile.discordId === member.id)) {
        members.push(new profileModel({ discordId: member.id, guildId: member.guild.id }));
      }
    });
  }

  await profileManager.createMany(members);

});
