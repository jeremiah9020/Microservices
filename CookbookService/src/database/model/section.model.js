const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the section model, accessible under sequelize.models.section
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('section', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Recipes'
    },
  });
};