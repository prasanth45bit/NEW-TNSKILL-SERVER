const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sql');

const Complaint = sequelize.define('Complaint', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.ENUM('school','hospital','energy','transport','tourism','other'), defaultValue: 'other' },
  status: { type: DataTypes.ENUM('open','in-progress','resolved','closed'), defaultValue: 'open' },
  priority: { type: DataTypes.ENUM('low','medium','high'), defaultValue: 'medium' },
  reporterId: { type: DataTypes.INTEGER },
  reporterName: { type: DataTypes.STRING },
  assignedTo: { type: DataTypes.INTEGER },
  imageLink: { type: DataTypes.STRING },
  locationLink: { type: DataTypes.STRING },
  resolvedAt: { type: DataTypes.DATE },
  notes: { type: DataTypes.TEXT },
});

module.exports = Complaint;
