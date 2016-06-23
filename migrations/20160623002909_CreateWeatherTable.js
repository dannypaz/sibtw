exports.up = function(knex, Promise) {
  knex.schema.createTableIfNotExists('weather', (table) => {
    table.increments();
    table.string('status');
    table.string('statusicon');
    table.float('temperature');
    table.float('windspeed');
  });
};
