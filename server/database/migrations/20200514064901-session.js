import fs from 'fs';

module.exports = {
  up: async (queryInterface) => {
    const sql = fs.readFileSync('node_modules/connect-pg-simple/table.sql');
    const statements = sql.toString().split(';');
    return statements.map((statement, i) => {
      if (statement.trim() !== '' && i !== 0) {
        return queryInterface.sequelize.query(`${statement};`);
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('session');
  },
};
