import { Telegraf } from "telegraf";
import { IContextInterface } from "../context/context.interface";
import fs from "fs";
import { Db } from "mongodb";

export abstract class Command {
  data = JSON.parse(String(fs.readFileSync("./data.json")));
  constructor(public bot: Telegraf<IContextInterface>, public db: Db) {}
  abstract handle(): void;
}
