import fs from 'fs';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const sql = fs.readFileSync('node_modules/connect-pg-simple/table.sql');
    const statements = sql.toString().split(';');
    return queryInterface.sequelize.query(`${statements[0]};`);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('session');
  },
};
