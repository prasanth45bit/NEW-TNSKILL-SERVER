const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const Tourism = sequelize.define('Tourism', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT },
  ImageLink: { type: DataTypes.STRING },
  locationLink: { type: DataTypes.STRING },
  contact: { type: DataTypes.STRING },
});

module.exports = Tourism;
