import BaseCommand from "./base.command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";
import {createEmbedAlert} from "../utils/embed.utils";
import userManager from "../managers/user.manager";
import {createNewProperties} from "../utils/helpers";

const getRandomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class FishCommand extends BaseCommand {

  static command = "inipes";

  static async run (message: Message, command: CommandType) {

    const baseText = "Has pescado (X) y ahora forma parte de tu inventario";

    const fishes = getRandomNumberBetween(0, 3)

    const user = await userManager.getUserWithDSMember(message.member!);

    if (!user) {
      throw new Error("El usuario mencionado no tiene ningún usuario registrado");
    }

    const inventoryFishes = user.inventory.find(i => i.name === "pescados");

    if (!inventoryFishes) {
      await user.updateOne({
        $set: {
          inventory: [...user.inventory, { name: "pescados", quantity: fishes, properties: createNewProperties() } ]
        }
      }).exec();
    } else {
      await inventoryFishes.updateOne({
        $inc: {
          quantity: fishes
        }
      }).exec();
    }

    await message.reply({
      embeds: [ createEmbedAlert(baseText.replace("(X)", fishes.toString())) ]
    });

  }

}