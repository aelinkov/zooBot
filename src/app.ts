import { Telegraf } from "telegraf";
import { BotDb } from "./db/db.service";
import { IContextInterface } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import { AdminCommand } from "./commands/admin.command";

import { session } from "telegraf-session-mongodb";
import { IDbInterface } from "./db/db.interface";

class Bot {
  bot: Telegraf<IContextInterface>;
  commands: Command[] = [];
  constructor(
    private readonly dbService: IDbInterface
  ) {
    this.bot = new Telegraf<IContextInterface>(process.env.BOT_TOKEN as string);
    this.bot.use(
      session(this.dbService.getDb(), {
        sessionName: "session",
        collectionName: "sessions",
      })
    );
  }
  init() {
    this.commands = [new StartCommand(this.bot), new AdminCommand(this.bot)];
    for (const command of this.commands) {
      command.handle();
    }
    this.bot.launch();
  }
}
const bot = new Bot(BotDb);
bot.init();
