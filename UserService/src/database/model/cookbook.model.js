const { DataTypes, Sequelize } = require('sequelize');

/**
 * These are transitory values, they are used when referencing data from other services
 * @param {Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  return sequelize.define('cookbook', {
    cid: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};