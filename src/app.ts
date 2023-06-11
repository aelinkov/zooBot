import { Telegraf } from "telegraf";
import { IConfigInterface } from "./config/config.interface";
import { BotConfig } from "./config/config.service";
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
    private readonly configService: IConfigInterface,
    private readonly dbService: IDbInterface
  ) {
    this.bot = new Telegraf<IContextInterface>(
      this.configService.get("BOT_TOKEN")
    );
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
const bot = new Bot(BotConfig, BotDb);
bot.init();
