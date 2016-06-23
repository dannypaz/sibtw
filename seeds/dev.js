exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('weather').del()
    .then(() => {
      return Promise.all([
        knex('weather').insert({
          status: 'Clear',
          statusicon: 'clear-icon',
          temperature: '70.0',
          windspeed: '12.0',
        });
      ]);
    });
};
