import "dotenv/config";
import { connect } from "mongoose";
import { client } from "./bot";
import { loadCaches, loadEvents } from "./utils/helpers";

connect(process.env.MONGO_URL!).then(() => {
  console.log("Connected to db");
})
  .catch(() => console.log("Cannot connect to database"));

loadEvents();

loadCaches();

if (!process.env.TOKEN) {
  console.log('Bot token not found.');
  process.exit(1);
}

client.login(process.env.TOKEN).then(() => {
  console.log("Listening...");
});