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
    this.bot = new Telegraf<IContextInterface>("6470633353:AAGH6JU4wdb9e-NQAWNxz0yYTeWPl8VMk-8" as string);
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
      "https://grumpy-rugby-shirt-slug.cyclic.app//zoobot"
    );
    this.bot.webhookCallback(`/zoobot`);
     const webhookStatus = await this.bot.telegram.getWebhookInfo();
     console.log("Webhook status", webhookStatus);
    this.commands = [
      new StartCommand(this.bot, db),
      new AdminCommand(this.bot, db),
    ];
    for (const command of this.commands) {
      command.handle();
    }
  }
}

const dbClient = new MongoClient("mongodb+srv://aelinkov:yXrXPgfV8TtpXc2c@cluster0.dlrnyg6.mongodb.net/?retryWrites=true&w=majority" || process.env.MONGODB_URI as string);

dbClient
  .connect()
  .then(async (client) => {
    const BotDb = new DbService(client);
    const bot = new Bot(BotDb);
    await bot.init();
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(bot.bot.webhookCallback("/shakrobot"));
    app.get("/", (req: Request, res: Response) => res.send("ShakRoBot"));
    app.listen(port, () => {
      console.log(`Bot app listening on port ${port}!`);
    });
  })
  .catch((error) => {
    console.error(error);
    return false;
  });
