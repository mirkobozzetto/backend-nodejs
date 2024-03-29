import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const sql = postgres("...", { max: 1 });
const db = drizzle(sql);
await migrate(db, { migrationsFolder: "drizzle" });
await sql.end();
console.error("Error executing query", (err as Error).stack);

dotenv.config();

const app = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server listening on port http://8080");
});

const DB_URL = process.env.DATABASE_URL;

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function getPostgresVersion() {
  const client = await pool.connect();
  try {
    const response = await client.query("SELECT version()");
    console.log(response.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
  } finally {
    client.release();
  }
}

getPostgresVersion();
