import { SEVEN_DAYS_MS, THREE_DAYS_MS, TWO_DAYS_MS } from "../utils/constants";
import { PropertiesType } from "../types/properties.types";

const times = new Map<PropertiesType, number> ();

times.set("food", THREE_DAYS_MS);
times.set("water", TWO_DAYS_MS);
times.set("gas", THREE_DAYS_MS);
times.set("health", SEVEN_DAYS_MS);
times.set("service", SEVEN_DAYS_MS);

export default times;