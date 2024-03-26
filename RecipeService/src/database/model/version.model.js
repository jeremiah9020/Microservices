const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipe model, accessible under sequelize.models.version
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('version', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};