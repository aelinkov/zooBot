import { IDbInterface } from "./db.interface";
import { Db, MongoClient, Collection, ObjectId, Document } from "mongodb";

import { IUsersInterface } from "./users.interface";
import User from "./users.model";

export class UsersService implements IUsersInterface {
  private collection: Collection<User>;
  constructor(dbService: Db) {
    this.collection = dbService.collection("users");
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

//export const UsersDb = new UsersService();
