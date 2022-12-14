import "dotenv/config";
import { connect } from "mongoose";
import { client } from "./bot";
import { loadCaches, loadEvents } from "./utils/helpers";

connect(process.env.MONGO_URL!).then(() => {
  console.log("Connected to db");
})
.catch((e) => {console.log(e);console.log("Cannot connect to database"); process.exit(1)});

loadEvents();

loadCaches();

if (!process.env.TOKEN) {
  console.log('Bot token not found.');
  process.exit(1);
}

client.login(process.env.TOKEN).then(() => {
  console.log("Listening...");
});