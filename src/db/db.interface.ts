import { Db } from "mongodb";

export interface IDbInterface {
  getDb(): Db;
}
