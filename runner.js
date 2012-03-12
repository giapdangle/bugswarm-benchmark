#!/usr/bin/env node

var program = require('commander');

/**
 * This project should show us:
 *
 * - Total time for the whole benchmark
 * - Average time per message round-trip
 * - Time of the fastest message
 * - Time of the slowest message
 * - Total number of lost messages
 * - Average time spent making the connection
 * - Messages per second
 * - Inflection point for connections.
 * - Inflection point for messages.
 **/

program
    .option('-p, --messages', 'Number of messages to be sent.')
    .option('-c, --connections', 'Parallel connections.')
    .parse(process.argv);

