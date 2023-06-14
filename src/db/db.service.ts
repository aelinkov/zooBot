import { IDbInterface } from "./db.interface";
import { Db, MongoClient } from "mongodb";

export class DbService implements IDbInterface {
  private db: Db;
  constructor(dbClient: MongoClient) {
    // const client = new MongoClient(
    //   "mongodb+srv://tgBot:Knopa2a4@cluster0.x9uycny.mongodb.net/?retryWrites=true&w=majority" as string,
    //   {
    //     monitorCommands: true,
    //   }
    // );
    //client.connect();
    this.db = dbClient.db("shak_bot");
  }
  getDb() {
    if (!this.db) {
      throw new Error("No connections to DB");
    }
    return this.db;
  }
}

//export const BotDb = new DbService();
