import { Context, Markup, Telegraf } from "telegraf";
import { IContextInterface } from "../context/context.interface";
import { Command } from "./command.class";
import { UsersService } from "../db/users.service";
import User from "../db/users.model";
import { Db } from "mongodb";
import fs from "fs";

export class StartCommand extends Command {
  mainButtom = Markup.keyboard(
    [
      Markup.button.text("Записаться"),
      Markup.button.text("Информация"),
      Markup.button.text("О репетиторе"),
      Markup.button.text("Цены"),
    ],
    { columns: 2 }
  ).resize();
  constructor(bot: Telegraf<IContextInterface>, db: Db) {
    super(bot, db);
  }

  UsersDb = new UsersService(this.db);

  handle(): void {
    this.bot.start(async (ctx) => {
      const currentUser = await this.UsersDb.currentUser(ctx.from as User);

      ctx.session.state = {
        ...ctx.session.state,
        user: currentUser,
      };
      ctx.reply(
        `Здравствуйте, я 🤖 ${ctx.botInfo.username}! 👋
  
${this.data.start_introduction}
  
Просто жми Записаться ⬇️`,
        this.mainButtom
      );
    });

    this.bot.action(/.*/, async (ctx) => {
      ctx.deleteMessage();
      ctx.sendChatAction("typing");
      if (ctx.match[0] === "booking" || !ctx.session.state.booking) {
        ctx.session.state.booking = [];
      } else {
        ctx.session.state.booking[ctx.session.state.step - 1] = {
          question:
            this.data.booking[String(ctx.session.state.step - 1)].question,
          answer: ctx.match[0],
        };
      }
      if (ctx.session.state.step < Object.keys(this.data.booking).length) {
        let { buttons, question } =
          this.data.booking[String(ctx.session.state.step)];
        ctx.session.state.step = ctx.session.state.step + 1;
        if (buttons.includes(ctx.match[0])) {
          buttons =
            this.data.booking[String(ctx.session.state.step + 1)].buttons;
          question =
            this.data.booking[String(ctx.session.state.step + 1)].question;
        }
        ctx.reply(
          question,
          Markup.inlineKeyboard(
            buttons.map((text: string) => Markup.button.callback(text, text)),
            { columns: 1 }
          )
        );
      } else if (
        ctx.session.state.step === Object.keys(this.data.booking).length
      ) {
        const currentUser = await this.UsersDb.currentUser({
          ...ctx.session.state.user,
          booking: ctx.session.state.booking,
        } as User);
        ctx.reply(this.data.booking_conclusion, this.mainButtom);
        ctx.telegram.sendMessage(
          process.env.ADMIN_ID as string,
          `🐈‍⬛ <b>Мяу!</b> У тебя новая заявка!
🌚 ${currentUser?.first_name || ""} ${
            currentUser?.last_name || ""
          }( <a href="tg://user?id=${currentUser?.id}">${
            currentUser?.username
          }</a>)
📱 <a href="tel:+${currentUser?.phone}">+${currentUser?.phone}</a>
${currentUser?.booking
  ?.map(({ question, answer }) => `<b>${question}</b> \n- ${answer};`)
  .join("\n")}
        `,
          { parse_mode: "HTML" }
        );
      }
    });
    this.bot.hears("Записаться", (ctx) => {
      ctx.sendChatAction("typing");
      if (ctx.session.state?.step === Object.keys(this.data.booking).length) {
        ctx.reply(
          "Вы уже записались, в ближайшее время с Вами свяжуться",
          this.mainButtom
        );
      } else {
        ctx.reply(
          "Пожалуйста, отправьте свой номер телефона с помощью кнопки ⬇️",
          Markup.keyboard(
            [Markup.button.contactRequest("📲 Отправить номер телефона")],
            { columns: 1 }
          )
            .oneTime()
            .resize()
        );
      }
    });

    this.bot.hears("Информация", async (ctx) => {
      await ctx.reply(this.data.start_information);
      await ctx.sendChatAction("typing");
      await ctx.reply(this.data.booking_information);
    });

    this.bot.hears("О репетиторе", async (ctx) => {
      await ctx.replyWithPhoto({ source: fs.createReadStream("img/p0.jpg") });
      await ctx.reply(this.data.start_about);
    });

    this.bot.hears("Цены", async (ctx) => {
      await ctx.reply(this.data.meet_price);
      await ctx.sendChatAction("typing");
      await ctx.reply(this.data.start_price);
    });

    this.bot.phone(/.*/, async (ctx) => {
      const currentUser = await this.UsersDb.currentUser(ctx.from as User);
      ctx.session.state = {
        ...ctx.session.state,
        user: currentUser,
        step: 0,
      };
      //ctx.session.state.step = 0;
      await ctx.replyWithSticker(
        "CAACAgIAAxkBAAEJPNZkgDAUMvGqgerirPzhk45XupiuUQACTAADECECECzc2LJC3vYxLwQ"
      );
    });

    this.bot.on("contact", async (ctx: any) => {
      const contact = await ctx.message.contact.phone_number;
      ctx.session.state.user.phone = contact;
      ctx.session.state.step = 0;
      await ctx.reply(
        this.data.booking_introduction,
        Markup.inlineKeyboard([Markup.button.callback("Вперед", "booking")])
      );
    });
  }
}
