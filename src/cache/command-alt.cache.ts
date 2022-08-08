import BaseCommand from "../commands/base.command";
import {readdirSync} from "fs";
import {join} from "path";

const commandsAltCache = new Map<string, typeof BaseCommand>();

readdirSync(join(__dirname, "../commandsAlt/"))
  .filter((c) => c !== "base.command.ts" && c !== "base-command.js")
  .forEach(async (c) => {
    const command = (await import(join(__dirname, `../commandsAlt/${c}`))).default;

    console.log("Loading command", command.command);

    commandsAltCache.set(command.command, command);
  });

export default commandsAltCache;