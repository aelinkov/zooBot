import { Context, Markup, Telegraf } from "telegraf";
import { IContextInterface } from "../context/context.interface";
import { Command } from "./command.class";
import { Db } from "mongodb";

export class AdminCommand extends Command {
  constructor(bot: Telegraf<IContextInterface>, db: Db) {
    super(bot, db);
  }
  handle(): void {
    this.bot.command("admin", (ctx: Context) => ctx.reply("Hello"));
  }
}
