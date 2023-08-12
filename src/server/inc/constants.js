"use strict";

require("dotenv").config();

const MODE = process.env.MODE || "development",
  PORT = process.env.PORT || 0,
  PUBLIC_URL = process.env.PUBLIC_URL || null,
  DB_HOST = process.env.DB_HOST || null,
  DB_PORT = process.env.DB_PORT || 0,
  DB_USER = process.env.DB_USER || null,
  DB_PASS = process.env.DB_PASS || null,
  DB_DATABASE = process.env.DB_DATABASE || null,
  GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS || null;

const { Pool } = require("pg");

const dbpool = new Pool({
  user: DB_USER,
  database: DB_DATABASE,
  password: DB_PASS,
  port: DB_PORT,
  host: DB_HOST,
});

module.exports = { dbpool, MODE, PORT, PUBLIC_URL, GOOGLE_ANALYTICS };
