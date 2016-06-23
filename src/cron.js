/**
 * @summary Cron job that receives and saves Chicago weather data.
 * @desc Cron job that grabs Chicago weather data from Forecast.io and inputs
 * into postgres via knex/bookshelf. Interval is every minute. The job ignores
 * API failures and will log info, then retry.
 *
 * After the 5th failure, a notification will be sent to the developers.
 */

const https = require('https');

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
  console.log('Response: ', res);
}

function formatResponse(res) {
  let data;
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
