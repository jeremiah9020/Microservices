const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipe model, accessible under sequelize.models.recipe
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('recipe', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    }    
  });
};