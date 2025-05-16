require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, process.env.DATABASE_STORAGE),
  logging: false,
});

module.exports = sequelize;
