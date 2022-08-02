import { EmbedBuilder, Message } from "discord.js";
import { itemModel } from "../models/item.model";
import BaseCommand from "./base.command";

export default class StoreCommand extends BaseCommand {

    static command = "tienda";

    static async run(message: Message, ) {

        const items = await itemModel.find({}).exec();

        const embed = EmbedBuilder.from({
            title: "Tienda",
            fields: items.map((i) => ({
                name: `${i.name}`,
                value: `Roles que puede comprar:\n ${i.roles.length ? i.roles.map((r) => `<@&${r}>`).join(" ") : "@everyone"}`
            })),
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
        });

        message.reply({
            embeds: [embed]
        })

    }
}