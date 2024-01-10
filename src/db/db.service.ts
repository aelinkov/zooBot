import { IDbInterface } from "./db.interface";
import { Db, MongoClient } from "mongodb";

export class DbService implements IDbInterface {
  private db: Db;
  constructor(dbClient: MongoClient) {

    this.db = dbClient.db("zooBot");
  }
  getDb() {
    if (!this.db) {
      throw new Error("No connections to DB");
    }
    return this.db;
  }
}

//export const BotDb = new DbService();
