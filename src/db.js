require('dotenv').config();
require('reflect-metadata');
const { DataSource } = require('typeorm');
const Document = require('./models/document.entity');

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true, // crea tablas automáticamente en dev!
  logging: false,
  entities: [Document],
});

module.exports = { AppDataSource };
