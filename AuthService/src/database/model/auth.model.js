const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the user model, accessible under sequelize.models.user
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  sequelize.define('auth', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};