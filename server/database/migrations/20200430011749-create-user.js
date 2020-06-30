const { sequelize } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emailNotify: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      verified: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      inAppNotify: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      profilePic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expiredAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('Users'),
};
