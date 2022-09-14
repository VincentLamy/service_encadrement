const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.TABLE_NAME, process.env.DB_USER, process.env.DB_PASSWORD, { host: process.env.DB_ADDRESS, dialect: "mysql" });

module.exports = sequelize;
global.sequelize = sequelize;