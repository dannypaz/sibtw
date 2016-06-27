function up(knex, Promise) {
  return knex.schema.createTableIfNotExists('weather', (table) => {
    table.increments();
    table.string('status');
    table.string('statusicon');
    table.float('temperature');
    table.float('windspeed');
  });
};

exports.up = up;
exports.down = () => {};
