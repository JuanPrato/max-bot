import BaseCommand from "../commands/base-command";
import { readdirSync } from "fs";
import { join } from "path";

const commandsCache = new Map<string, typeof BaseCommand>();

readdirSync(join(__dirname, "../commands/"))
  .filter((c) => c !== "base-command.ts" && c !== "base-command.js")
  .forEach(async (c) => {
    const command = (await import(join(__dirname, `../commands/${c}`))).default;

    console.log("Loading command", command.command);

    commandsCache.set(command.command, command);
  });

export default commandsCache;