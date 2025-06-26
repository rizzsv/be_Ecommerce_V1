import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db";
import { publicApi } from "./App/publicApi";
import { privateApi } from "./App/privateApi";

dotenv.config();
const app = express();
app.use(express.json());

connectDb();

app.get("/", (_, res) => {
  res.send("API Running");
});

// Apply public Api Router
app.use(publicApi)

// Apply Private Api Router
app.use(privateApi)

// Apply Error Middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
