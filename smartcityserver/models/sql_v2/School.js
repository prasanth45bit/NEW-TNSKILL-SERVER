const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const School = sequelize.define('School', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER },
  contact: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  imageLink: { type: DataTypes.STRING },
  locationLink: { type: DataTypes.STRING },
});

module.exports = School;
