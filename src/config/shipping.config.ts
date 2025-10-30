import dotenv from "dotenv";
dotenv.config();

export const binderbyteConfig = {
  baseUrl: "https://api.binderbyte.com/v1",
  apiKey: process.env.BINDERBYTE_API_KEY || "",
};
