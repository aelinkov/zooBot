import { Context, Markup, Telegraf } from "telegraf";
import { IContextInterface } from "../context/context.interface";
import { Command } from "./command.class";

export class AdminCommand extends Command {
  constructor(bot: Telegraf<IContextInterface>) {
    super(bot);
  }
  handle(): void {
    this.bot.command("admin", (ctx: Context) => ctx.reply("Hello"));
  }
}
