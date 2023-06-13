import express, { Request, Response } from "express";
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
  constructor(private readonly dbService: IDbInterface) {
    this.bot = new Telegraf<IContextInterface>(process.env.BOT_TOKEN as string);
    this.bot.use(
      session(this.dbService.getDb(), {
        sessionName: "session",
        collectionName: "sessions",
      })
    );
  }
  async init() {
    await this.bot.telegram.setWebhook(
      "https://ill-puce-termite-belt.cyclic.app/shakrobot"
    );
    //await bot.bot.startWebhook(`/shakrobot`);
    const webhookStatus = await this.bot.telegram.getWebhookInfo();
    console.log("Webhook status", webhookStatus);
    this.commands = [new StartCommand(this.bot), new AdminCommand(this.bot)];
    for (const command of this.commands) {
      command.handle();
    }
    this.bot.launch();
  }
}

const bot = new Bot(BotDb);
bot.init();
const app = express();
const port = process.env.PORT || 3000;
// app.use(bot.bot.webhookCallback("/shakrobot"));
app.get("/", (req, res) => res.send("Hello World!"));

// app.post("/shakrobot", (req: Request, res: Response) => {
//   console.log(req.body);
//   return bot.bot.handleUpdate(req.body, res);
// });

app.listen(port, () => {
  console.log(`Bot app listening on port ${port}!`);
});
