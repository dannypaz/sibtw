/**
 * @summary Cron job initializer for forecast.io API calls
 */

// Load .env file for application
require('dotenv').config();

const Runnr = require('node-runnr');
const cron = require('./src/cron');

const Jobs = new Runnr();

const interval = Jobs.interval(cron.name, '0:02', cron.details)
                   .job(cron.job)
                   .exit(cron.exit);

Jobs.begin();
