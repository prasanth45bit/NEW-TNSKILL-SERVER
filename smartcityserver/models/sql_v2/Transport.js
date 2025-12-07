const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const Transport = sequelize.define('Transport', {
  mode: { type: DataTypes.STRING },
  route: { type: DataTypes.STRING },
  operator: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER },
  notes: { type: DataTypes.TEXT },
  imageLink: { type: DataTypes.STRING },
  locationLink: { type: DataTypes.STRING },
});

module.exports = Transport;
