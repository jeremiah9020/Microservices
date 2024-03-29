const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipe model to get/store recipe id's, accessible under sequelize.models.recipe
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('recipe', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  });
};