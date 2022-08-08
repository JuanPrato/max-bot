import {PropertiesType} from "../types/properties.types";

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

const diseaseMap = new Map<string, string>();

diseaseMap.set("dehydratation", "dehidratación");
diseaseMap.set("malnutrition", "malnutrición");
diseaseMap.set("cough", "tos");
diseaseMap.set("dementia", "demencia");
diseaseMap.set("cancer", "cáncer");

export const getTranslatedProperty = (property: string) => translateMap.get(property) || property;

export const getEnglishProperties = (): PropertiesType[] => ["water", "food", "gas", "health", "service"];

export const getEmoji = (property: string) => emojiMap.get(property) || property[0] || property;

export const getDisease = (disease: string) => diseaseMap.get(disease) || disease;

export const getDiseases = () => [ "dehidratation", "malnutrition", "cough", "dementia", "cancer" ];
