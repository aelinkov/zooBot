import { ObjectId } from "mongodb";

export default class User {
  constructor(
    public id: number,
    public is_bot: boolean,
    public first_name: string,
    public last_name: string,
    public username: string,
    public phone?: string,
    public language_code?: "ru" | "en",
    public booking?: {
      question: string;
      answer: string;
    }[],
    public id_?: ObjectId
  ) {}
}
