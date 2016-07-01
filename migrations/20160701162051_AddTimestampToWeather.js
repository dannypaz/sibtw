function up(knex, Promise) {
  return knex.schema.table('weather', (table) => {
    table.timestamps();
  })
};

exports.up = up;
exports.down = () => {};
