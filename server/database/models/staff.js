module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    'Staff',
    {
      userId: DataTypes.INTEGER,
      organizationId: DataTypes.INTEGER,
    },
    {}
  );
  Staff.associate = (models) => {
    // associations can be defined here
    Staff.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Staff.belongsTo(models.Organization, {
      foreignKey: 'organizationId',
      as: 'organization',
    });
  };
  return Staff;
};
