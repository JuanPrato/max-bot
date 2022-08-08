import {IConfig} from "../types/config.type";
import {configModel} from "../models/config.model";

const configCache = new Map<string, IConfig>();

async function loadCache() {
  const configs = await configModel.find().exec();
  for (const config of configs) {
    configCache.set(config.guildId, config);
  }
}

loadCache();

export default configCache;