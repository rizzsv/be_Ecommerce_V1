import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db";

dotenv.config();
const app = express();
app.use(express.json());

connectDb();

app.get("/", (_, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
