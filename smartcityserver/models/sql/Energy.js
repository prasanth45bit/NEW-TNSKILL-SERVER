const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const Energy = sequelize.define('Energy', {
  provider: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  capacity_kw: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
});

module.exports = Energy;
