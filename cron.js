/**
 * @summary Cron job initializer for forecast.io API calls
 * @desc This is the starting point of every cron job for the forecast.io API.
 * All jobs are created and ran from this point using the cron utility.
 */

const Runnr = require('node-runnr');
const cron = require('./src/cron');

const Jobs = new Runnr();

// TODO:
// Move weather jobs into its own table in the db
const weatherJobs = [{
  name: 'chicago-forecast.io',
  lat: 41.8843,
  lon: -87.6324,
}];
const firstJob = weatherJobs[0];

// TODO:
// Add batch creation of jobs using promises
Jobs.interval(firstJob.name, '10:00', firstJob)
    .job(cron.startJob)
    .exit(cron.exit);

Jobs.begin();
