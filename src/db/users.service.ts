import { IDbInterface } from "./db.interface";
import { Db, MongoClient, Collection, ObjectId, Document } from "mongodb";
import { BotConfig } from "../config/config.service";

import { BotDb } from "./db.service";
import { IUsersInterface } from "./users.interface";
import User from "./users.model";

class UsersService implements IUsersInterface {
  private collection: Collection<User>;
  constructor() {
    this.collection = BotDb.getDb().collection("users");
  }
  async getAll() {
    const results = await this.collection.find({}).toArray();
    return results;
  }
  async currentUser(user: User) {
    const query = { id: user.id };

    const results = await this.collection.findOneAndUpdate(
      query,
      {
        $set: user,
      },
      {
        returnDocument: "after",
        upsert: true, // Make this update into an upsert
      }
    );
    return results.value;
  }
}

export const UsersDb = new UsersService();
