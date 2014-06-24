#!/usr/bin/env node

var program = require('commander'),
    colors = require('colors'),
    hurl = require('../lib');

var upstream, options, server;

//
// Option Parsers
//
function host(val) {
  var host = {};

  chunks = val.trim().split(':');
  host.host = chunks[0] || 'localhost';
  host.port = (chunks.length > 1 && !!chunks[1]) ? parseInt(chunks[1]) : 80;

  return host;
}

//
// Commandline Options
//
program
  .version(hurl.version)
  .usage('hostname:port [options]')
  .option('-l, --listen <port>', 'port to listen for incoming requests (default: 8000)', parseInt, 8000)
  .option('-t, --timeout <ms>', 'proxy timeout in milliseconds (default: 120000)', parseInt, 120000)
  .option('-f, --forward <hostname:port>', 'forward requests to an additional destination', host)
  .option('-x, --extra', 'enable x-headers (x-forwarded-for, x-forwarded-port, x-forwarded-proto)')
  .option('-ws, --web-sockets', 'enable WebSockets proxy')
  .parse(process.argv);

if (!program.args.length) {
  console.error();
  console.error("  Error: hostname:port required. Please provide the destination server hostname and port.".red);
  program.help();
}

//
// Prepare options
//
target = host(program.args[0]);
options = {
  target: target,
  listen: program.listen,
  proxyTimeout: program.timeout,
  xfwd: !!program.extra
};

if (program.forward) {
  options.forward = program.forward;
}

//
// Start proxy server
//
server = hurl.start(options);

//
// Signal handlers
//
if (process.platform !== 'win32') {
  //
  // Signal handlers don't work on Windows.
  //
  process.on('SIGINT', function () {
    console.error('hurl stopped'.red);
    process.exit();
  });
}
