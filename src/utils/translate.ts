const translateMap = new Map<string, string>();

translateMap.set("water", "agua");
translateMap.set("food", "comida");
translateMap.set("gas", "gasolina");
translateMap.set("health", "salud");
translateMap.set("service", "servicio");

translateMap.set("agua", "water");
translateMap.set("comida", "food");
translateMap.set("gasolina", "gas");
translateMap.set("salud", "health");
translateMap.set("servicio", "service");

const emojiMap = new Map<string, string>();

emojiMap.set("water", "💧");
emojiMap.set("food", "🍕");
emojiMap.set("gas", "⛽");
emojiMap.set("health", "🩹");
emojiMap.set("service", "🛠️");

export const getTranslatedProperty = (property: string) => translateMap.get(property) || property;

export const getEnglishProperties = () => ["water", "food", "gas", "health", "service"];

export const getEmoji = (property: string) => emojiMap.get(property) || property[0] || property;