#!/usr/bin/env node

var program = require('commander');
var uubench = require('uubench');
var SwarmConn = require('bugswarm-prt').Swarm;

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
    .option('-c, --connections [number]', 'Number of connections [10]', 10)
    .option('-m, --messages [number]', 'Number of messages per connection that will be send [100]', 100)
    .option('-d, --delay [ms]', 'Delay between connections [500]', 500)
    .option('-t, --timeout [ms]', 'Timeout [1000]', 1000)
    .option('-a, --credentials [swarm information]', 'Swarm credentials to run the tests, following the format: apikey:resource_id:swarm_id value')
    .parse(process.argv);

//Setting up bugswarm client
if (!program.credentials) {
    throw new Error('You must provide your participation key as well as swarm and resource ids in order to start the benchmark');
}
var credentials = program.credentials.split(':');

var options = {
    apikey: credentials[0],
    resource: credentials[1],
    swarms: credentials[2]
};

//Data points to keep track on
var stats = {
    connections: {
        succeeded: 0,
        failed: 0,
        fastest: 0, //ms
        slowest: 0, //ms
        avg_time_establishment: 0,
        avg_conn_per_sec: 0,
        total: 0
    },

    messages: {
        sent: 0,
        received: 0,
        slowest: 0, //ms
        fastest: 0, //ms
        avg_msgs_per_sec: 0,
        avg_roundtrip_time: 0
    }
};


var swarmConn = new SwarmConn(options);
swarmConn.on('error', function(error) {
    console.log(error);
    //ignore application errors
});

var msgs = program.messages;
var conns = program.connections;

swarmConn.on('message', function(message) {
    console.log(message);
});

swarmConn.on('connect', function() {
    console.log('connected!!');
    for (var i = 0; i < msgs; i++) {
        swarmConn.send(' msg number ' + i);
    }
});


while (conns--) {
    setTimeout(function() {
        swarmConn.connect();
    }, program.delay);
}



