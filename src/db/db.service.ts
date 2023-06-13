import { IDbInterface } from "./db.interface";
import { Db, MongoClient } from "mongodb";

class DbService implements IDbInterface {
  private db: Db;
  constructor() {
    const client = new MongoClient(process.env.MONGODB_URI as string, {
      monitorCommands: true,
    });
    client.connect();
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
