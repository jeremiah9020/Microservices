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
    references: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });
};