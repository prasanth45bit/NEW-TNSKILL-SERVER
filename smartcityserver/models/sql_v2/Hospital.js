const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const Hospital = sequelize.define('Hospital', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  beds: { type: DataTypes.INTEGER },
  contact: { type: DataTypes.STRING },
  emergency: { type: DataTypes.BOOLEAN, defaultValue: false },
  imageLink: { type: DataTypes.STRING },
  locationLink: { type: DataTypes.STRING },
});

module.exports = Hospital;
