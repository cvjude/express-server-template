module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'Users',
          'emailVerification',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'Users',
          'expiredAt',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t }
        ),
      ])),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('Users', 'emailVerification', {
          transaction: t,
        }),
        queryInterface.removeColumn('Users', 'expiredAt', { transaction: t }),
      ])),
};
