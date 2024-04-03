const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipe model, accessible under sequelize.models.recipe
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('recipe', {
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public'
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });
};