const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the cookbook model to get/store cookbook id's, accessible under sequelize.models.cookbook
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('cookbook', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  });
};