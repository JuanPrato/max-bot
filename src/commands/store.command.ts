import { Embed, EmbedBuilder, Message } from "discord.js";
import { itemModel } from "../models/item.model";
import BaseCommand from "./base.command";

export default class StoreCommand extends BaseCommand {

    static command = "tienda";

    static async run(message: Message, ) {

        const items = await itemModel.find({}).exec();

        const embed = EmbedBuilder.from({
            title: "Tienda",
            fields: items.map((i) => ({
                name: `${i.name} - stock: ${i.stock}`,
                value: `Roles que puede comprar:\n ${i.roles.length ? i.roles.map((r) => `<@&${r}>`).join(" ") : "@everyone"}`
            })),
        });

        message.reply({
            embeds: [embed]
        })

    }
}