import { client } from "../bot";
import { userModel } from "../models/user.model";

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;

client.on("ready", () => {

    const THREE_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    const ONE_PERCETER_DAYS = THREE_DAYS_MS / 100;

    const removePercentage = FIVE_MINUTES_IN_MS / ONE_PERCETER_DAYS;

    setInterval( async () => {
        
        const users = await userModel.find({}).exec();

        for (const user of users) {
            user.updateOne({
                properties: {
                    $inc: {
                        food: -removePercentage
                    }
                }
            });
        }

    }, FIVE_MINUTES_IN_MS);

});