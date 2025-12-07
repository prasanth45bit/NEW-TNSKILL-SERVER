const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const Tourism = sequelize.define('Tourism', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT },
  contact: { type: DataTypes.STRING },
  imageLink: { type: DataTypes.STRING },
  locationLink: { type: DataTypes.STRING },
});

module.exports = Tourism;
