/**
 * @summary Utilities for creating urls for each individual cron
 */

const API_KEY = process.env.FORECAST_IO_API_KEY || 'no-key-available';
const FORECAST_IO_URL = process.env.FORECAST_IO_URL || 'https://api.forecast.io/forecast';

function getRequestUrl(lat, long) {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${lat},${long}`;
}

function getBaseUrl() {
  if (API_KEY == 'no-key-available') {
    throw 'No API_KEY specified. Please check your ENV file or server vars';
  }
  return `${FORECAST_IO_URL}/${API_KEY}`;
}

exports.requestUrl = getRequestUrl;
