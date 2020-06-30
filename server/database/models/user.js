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
      verified: DataTypes.BOOLEAN,
    },
    {
      getterMethods: {
        uuid_slug() {
          return uuid();
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          user.password = await hashPassword(user.password);
        },
      },
    }
  );

  User.beforeCreate((user) => {
    user.id = uuid();
  });

  User.associate = (models) => {};

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
