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


export const getTranslatedProperty = (property: string) => translateMap.get(property) || property;