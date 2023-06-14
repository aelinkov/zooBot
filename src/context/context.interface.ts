import { Context } from "telegraf";
import User from "../db/users.model";

export interface ISessionInterface {
  state: {
    step: number;
    booking?: {
      question: string;
      answer: string;
    }[];
    user: User | null;
  };
}

export interface IContextInterface extends Context {
  session: ISessionInterface;
}
