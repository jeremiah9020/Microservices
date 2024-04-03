const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipe model, accessible under sequelize.models.recipe
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('recipe', {
    rid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    }    
  });
};