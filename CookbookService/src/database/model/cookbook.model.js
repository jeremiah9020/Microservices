const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the cookbook model, accessible under sequelize.models.cookbook
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('cookbook', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    },
    references: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    times_copied: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_a_copy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'private'
    }
  });
};