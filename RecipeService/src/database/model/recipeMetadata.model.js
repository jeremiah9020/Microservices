const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipeMetadata model, accessible under sequelize.models.recipeMetadata
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  sequelize.define('recipeMetadata', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    },
    versions: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{}'
    },
    latest: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};