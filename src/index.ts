import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { connectDb } from "./config/db";
import { publicApi } from "./App/publicApi";
import { privateApi } from "./App/privateApi";
import {globalErrorHandler } from "./middleware/error.middleware"

dotenv.config();
const app = express();
app.use(express.json());

connectDb();

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
}))

app.get("/", (_, res) => {
  res.send("API Running");
});

// Apply public Api Router
app.use(publicApi)

// Apply Private Api Router
app.use(privateApi)

// Apply Error Middleware
app.use(globalErrorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 BOOM! Server ignited on port ${PORT}. Let’s build something awesome!`));
