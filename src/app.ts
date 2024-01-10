import express, { Request, Response } from "express";
import { Telegraf } from "telegraf";
import { IContextInterface } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import { AdminCommand } from "./commands/admin.command";

import { session } from "telegraf-session-mongodb";
import { IDbInterface } from "./db/db.interface";
import { MongoClient } from "mongodb";
import { DbService } from "./db/db.service";

class Bot {
  bot: Telegraf<IContextInterface>;
  commands: Command[] = [];
  constructor(private readonly dbService: IDbInterface) {
    this.bot = new Telegraf<IContextInterface>(process.env.BOT_TOKEN as string);
  }
  async init() {
    const db = this.dbService.getDb();
    this.bot.use(
      session(db, {
        sessionName: "session",
        collectionName: "bot",
      })
    );
    await this.bot.telegram.setWebhook(
      `${process.env.CYCLIC_URL}//zoobot`
    );
    this.bot.webhookCallback(`/zoobot`);
    // const webhookStatus = await this.bot.telegram.getWebhookInfo();
    // console.log("Webhook status", webhookStatus);
    this.commands = [
      new StartCommand(this.bot, db),
      new AdminCommand(this.bot, db),
    ];
    for (const command of this.commands) {
      command.handle();
    }
  }
}

const dbClient = new MongoClient(process.env.MONGODB_URI as string);

dbClient
  .connect()
  .then(async (client) => {
    const BotDb = new DbService(client);
    const bot = new Bot(BotDb);
    await bot.init();
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(bot.bot.webhookCallback("/zoobot"));
    app.get("/", (req: Request, res: Response) => res.send("zooBot"));
    app.listen(port, () => {
      console.log(`Bot app listening on port ${port}!`);
    });
  })
  .catch((error) => {
    console.error(error);
    return false;
  });
