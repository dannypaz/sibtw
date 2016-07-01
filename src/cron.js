/**
 * @summary Cron job that receives and saves Chicago weather data.
 * @desc Cron job that grabs Chicago weather data from Forecast.io and inputs
 * into postgres via knex/bookshelf. Interval is every minute. The job ignores
 * API failures and will log info, then retry.
 *
 * After the 5th failure, a notification will be sent to the developers.
 *
 * TODO:
 * ADD SOME BETTER ERROR HANDLING. The errors get buried inside of the pg
 * transaction :(
 */

const https = require('https');
const pg = require('knex')(require('../knexfile'));
const urlCreator = require('./url-creator');

function startJob(_data, _next, exit) {
  console.log(`Starting ${this.details.name} cron @ ${new Date().toString()}`);
  const url = urlCreator.requestUrl(this.details.lat, this.details.lon);
  return https.get(url, formatResponse)
              .on('finish', exit)
              .on('error', onHttpError);
}

function formatResponse(res) {
  let data= "";
  res.on('data', (d) => data += d);
  res.on('end', () => saveResponse(data));
}

function saveResponse(res) {
  const weather = JSON.parse(res);
  const currentWeather = {
    status: weather.currently.summary,
    statusicon: weather.currently.icon,
    temperature: weather.currently.temperature,
    windspeed: weather.currently.windSpeed,
  };

  pg.transaction((trx) => {
    pg.insert(currentWeather, 'id').into('weather').then((id) => {
      const weatherId = id[0];
      const hourlyWeather = weather.hourly.data.map((forecast) => {
        return {
          weather_id: weatherId,
          time: new Date(secondsToMilliseconds(forecast.time)),
          status: forecast.summary,
          statusicon: forecast.icon,
          temperature: forecast.temperature,
          windspeed: forecast.windspeed,
        };
      });
      return pg.insert(hourlyWeather).into('hourly_weather');
    });
  }).catch((err) => {
    console.error('Cron weather transaction failed: ', err);
  });
}

function secondsToMilliseconds(seconds) {
  return (seconds * 1000);
}

function onHttpError(err) {
  console.error('Request failed: ', err.message);
}

function exit() {
  console.log(`Finished ${this.details.name} cron @ ${new Date().toString()}`);
}

exports.startJob = startJob;
exports.exit = exit;
