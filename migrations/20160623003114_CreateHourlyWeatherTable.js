exports.up = function(knex, Promise) {
  knex.schema.createTableIfNotExists('hourly-weather', (table) => {
    table.increments();
    table.integer('weatherid');
    table.dateTime('time');
    table.string('status');
    table.string('statusicon');
    table.float('temperature');
    table.float('windspeed');
  });
};

