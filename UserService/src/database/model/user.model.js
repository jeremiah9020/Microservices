const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the user model, accessible under sequelize.models.user
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    // recipes: {
    //     type: DataTypes.TEXT,
    //     allowNull: false,
    //     defaultValue: '[]'
    // },
    // cookbooks: {
    //     type: DataTypes.TEXT,
    //     allowNull: false,
    //     defaultValue: '["default"]'
    // },
    // following: {
    //     type: DataTypes.TEXT,
    //     allowNull: false,
    //     defaultValue: '[]'
    // },
    // followers: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0
    // },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });
};