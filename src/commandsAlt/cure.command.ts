import BaseCommand from "../commands/base.command";
import {Message} from "discord.js";
import userManager from "../managers/user.manager";
import {getMemberByUser} from "../utils/helpers";

export default class CureCommand extends BaseCommand {

  static command = "emscurar";

  static async run (message: Message) {

    const mention = message.mentions.users.first();

    if (!mention) {
      throw new Error("Debe mencionar un usuario");
    }

    const user = await userManager.getUserWithDSMember(getMemberByUser(message.guild!, mention));

  }

}