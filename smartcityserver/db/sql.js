const { Sequelize } = require('sequelize');

const MYSQL_URI = process.env.MYSQL_URI || '';

let sequelize;
if (MYSQL_URI) {
  sequelize = new Sequelize(MYSQL_URI, { dialect: 'mysql', logging: false });
} else {
  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = process.env.MYSQL_PORT || 3306;
  const database = process.env.MYSQL_DB || 'smartcity_db';
  const username = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false,
  });
}

module.exports = { sequelize };
