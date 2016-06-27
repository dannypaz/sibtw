function seed(knex, Promise) {
  // Deletes ALL existing entries
  return knex('weather').del()
    .then(() => {
      const weatherSeed = knex('weather').insert({
        status: 'Clear',
        statusicon: 'clear-icon',
        temperature: '70.0',
        windspeed: '12.0',
      });
      const hourlyWeatherSeed = knex('hourly_weather').insert({
        weather_id: 1,
        time: new Date(),
        status: 'Clear',
        statusicon: 'clear-icon',
        temperature: '70.0',
        windspeed: '12.0',
      });

      return Promise.all([
        weatherSeed,
        hourlyWeatherSeed
      ]);
    });
};

exports.seed = seed;
