const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('admin', 'public'), defaultValue: 'public' },
  phone: { type: DataTypes.STRING },
});

module.exports = User;
