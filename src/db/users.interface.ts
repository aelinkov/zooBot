import { AggregationCursor, Document, InsertOneResult, WithId } from "mongodb";
import User from "./users.model";

export interface IUsersInterface {
  getAll(): Promise<WithId<Document>[]>;
  currentUser(user: User): Promise<User | null>;
}
