import helpers from '../../helpers';

const { hashPassword } = helpers;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      profilePic: DataTypes.STRING,
      emailNotify: DataTypes.BOOLEAN,
      inAppNotify: DataTypes.BOOLEAN,
      emailVerification: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          user.password = await hashPassword(user.password);
        },
      },
    }
  );

  User.associate = (models) => {
    // associations can be defined here
    User.hasOne(models.Organization, {
      foreignKey: 'ownerId',
      as: 'owner',
      cascade: true,
    });

    User.hasMany(models.Staff, {
      foreignKey: 'userId',
      as: 'staff',
    });
  };

  User.prototype.userResponse = function userResponse() {
    const userData = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      userName: this.userName,
      bio: this.bio,
      emailNotify: this.emailNotify,
      inAppNotify: this.inAppNotify,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return userData;
  };
  return User;
};
