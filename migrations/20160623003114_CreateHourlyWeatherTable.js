function up(knex, Promise) {
  return knex.schema.createTableIfNotExists('hourly_weather', (table) => {
    table.increments();
    table.integer('weather_id');
    table.dateTime('time');
    table.string('status');
    table.string('statusicon');
    table.float('temperature');
    table.float('windspeed');
    table.foreign('weather_id').references('weather.id');
  });
};

exports.up = up;
exports.down = () => {};
