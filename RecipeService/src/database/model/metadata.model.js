const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipeMetadata model, accessible under sequelize.models.metadata
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('metadata', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};