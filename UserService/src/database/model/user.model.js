const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the user model, accessible under sequelize.models.user
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });
};