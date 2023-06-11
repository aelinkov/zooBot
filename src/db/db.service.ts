import { IDbInterface } from "./db.interface";
import { Db, MongoClient } from "mongodb";
import { BotConfig } from "../config/config.service";

class DbService implements IDbInterface {
  private db: Db;
  constructor() {
    const client = new MongoClient(BotConfig.get("MONGODB_URI"), {
      monitorCommands: true,
    });
    this.db = client.db("shak_bot");
  }
  getDb() {
    if (!this.db) {
      throw new Error("No connections to DB");
    }
    return this.db;
  }
}

export const BotDb = new DbService();
