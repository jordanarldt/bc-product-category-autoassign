import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { apiRouter } from "./routes/api";

const app = express();
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../static")));
app.use("/api", apiRouter);

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${(listener.address() as any).port}`)
});
