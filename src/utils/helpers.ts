import { readdirSync } from "fs";
import { join } from "path";
import {CommandType} from "../types/command.type";
import {Message} from "discord.js";


export function info(message: string) {
  console.info(message);
}

export function error(message: string) {
  console.error(message);
}

export function quit(message: string) {
  error(message);
  process.exit(1); // Exit with no errors, since message was already logged.
}

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
