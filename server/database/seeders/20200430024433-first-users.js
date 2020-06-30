module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('Users', [
      {
        firstName: 'Admin',
        lastName: 'doe',
        userName: 'j_doe23',
        email: 'john.doe@test.com',
        role: 'admin',
        password:
          '$2a$06$xyxNkjOPug0TkLgpkrTaxOFAw6Yy0B52j00OiBWBYFdv0Br6Jcasm',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  down: (queryInterface) => queryInterface.dropAllTables(),
};
