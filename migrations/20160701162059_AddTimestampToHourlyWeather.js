function up(knex, Promise) {
  return knex.schema.table('hourly_weather', (table) => {
    table.timestamps();
  })
};

exports.up = up;
exports.down = () => {};
