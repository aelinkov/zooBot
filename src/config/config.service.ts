import { DotenvParseOutput, config } from "dotenv";
import { IConfigInterface } from "./config.interface";

class ConfigService implements IConfigInterface {
  private config: DotenvParseOutput;
  constructor() {
    const { parsed, error } = config();
    if (error) {
      throw new Error("Not found file .env");
    }
    if (!parsed) {
      throw new Error("File .env is empty");
    }
    this.config = parsed;
  }
  get(key: string): string {
    const conf = this.config[key];
    if (!conf) {
      throw new Error("Not found this key");
    }
    return conf;
  }
}

export const BotConfig = new ConfigService();

