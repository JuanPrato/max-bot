import BaseCommand from "./base-command";
import {Message} from "discord.js";
import {CommandType} from "../types/command.type";

export default class HelloCommand extends BaseCommand {

  static command = "hello"

  static async run(message: Message, commandRequest: CommandType) {

    message.reply("Hi! 👋");
  }

}