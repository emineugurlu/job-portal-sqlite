const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const JobPosting = sequelize.define('JobPosting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  salary: { type: DataTypes.STRING },
 attachment: { type: DataTypes.STRING }    // ← yeni alan
}, {
  timestamps: true,
});

module.exports = JobPosting;
