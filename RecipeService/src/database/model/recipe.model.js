const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipe model, accessible under sequelize.models.recipe
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  sequelize.define('recipe', {
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
    ratings: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]'
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });
};