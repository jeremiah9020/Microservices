const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the book model, accessible under sequelize.models.book
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  sequelize.define('book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    release_date: {
      type: DataTypes.DATEONLY,
    },
    subject: {
      type: DataTypes.INTEGER,
    }
  });
};