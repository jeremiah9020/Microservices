const { DataTypes, Sequelize } = require('sequelize');

/**
 * Defines the recipe model, accessible under sequelize.models.rating
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('rating', {
    owner: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};

