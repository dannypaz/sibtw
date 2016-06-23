/**
 * @summary Cron job that receives and saves Chicago weather data.
 * @desc Cron job that grabs Chicago weather data from Forecast.io and inputs
 * into postgres via knex/bookshelf. Interval is every minute. The job ignores
 * API failures and will log info, then retry.
 *
 * After the 5th failure, a notification will be sent to the developers.
 */

const https = require('https');
const pg = require('knex')(require('../knexfile'));

const jobName = 'chicago-forecast.io';
const API_KEY = process.env.FORECAST_IO_API_KEY || 'no-key-available';
const CHICAGO_LAT = 41.8843;
const CHICAGO_LONG = -87.6324;
const BASE_URL = `https://api.forecast.io/forecast/${API_KEY}`;
const REQUEST_URL = `${BASE_URL}/${CHICAGO_LAT},${CHICAGO_LONG}`;

function job() {
  console.log(`Starting ${jobName} cron`);
  https.get(REQUEST_URL, formatResponse).on('error', onError);
}

function saveResponse(res) {
  const weather = JSON.parse(res);
  const currentWeather = {
    status: weather.currently.summary,
    statusicon: weather.currently.icon,
    temperature: weather.currently.temperature,
    windspeed: weather.currently.windSpeed,
  };

  // TODO:
  // Need to add insert for hourly weather
  // Need to add error handling and checking incase transaction failes
  // Need to add error handling in case https fails
  // Add winston logging
  // Make this thing prettier

  pg.transaction((trx) => {
    pg.insert(currentWeather, 'id').into('weather').then((id) => {
      const hourlyWeather = weather.hourly.data.map((forecast) => {
        return {
          weatherid: id,
          time: forecast.time,
          status: forecast.summary,
          statusicon: forecast.icon,
          temperature: forecast.temperature,
          windspeed: forecast.windspeed,
        };
      });
    });
  });
}

function formatResponse(res) {
  let data= "";
  res.on('data', (d) => data += d);
  res.on('end', () => saveResponse(data));
}

function onError(err) {
  console.log('Request for ${jobName} failed: ', err.message);
}

function exit() {
  console.log(`Exiting ${jobName} cron`);
}

exports.job = job;
exports.exit = exit;
exports.name = jobName;
exports.details = {};
