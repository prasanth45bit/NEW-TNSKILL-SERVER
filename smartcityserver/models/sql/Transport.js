const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const Transport = sequelize.define('Transport', {
  mode: { type: DataTypes.STRING },
  route: { type: DataTypes.STRING },
  operator: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER },
  ImageLink: { type: DataTypes.STRING },
  locationLink: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
});

module.exports = Transport;
