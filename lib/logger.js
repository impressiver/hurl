winston = require('winston');

//
// Configure logger
//
var logger = new (winston.Logger)({
  levels: {
    'debug': 0,
    'info': 1,
    'notice': 2,
    'warning': 3,
    'err': 4,
    'crit': 5,
    'alert': 6,
    'emerg': 7,
    'hurl': 10      // Special log level to capture request/response
  },
  colors: {
    'hurl': 'blue'
  },
  transports: [
    new (winston.transports.Console)({ level: 'info', colorize: true, prettyPrint: true }),
    new (winston.transports.File)({ level: 'hurl', filename: 'hurl.log' })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ colorize: true, prettyPrint: true }),
    new (winston.transports.File)({ filename: 'hurl-errors.log', prettyPrint: true })
  ]
});


//
// Add request/response logging
//
Object.defineProperties(logger, {
  request: {
    value: function(req, options) {
      // logger.info('request', arguments);

      var lines = [
        'Request @ ' + new Date().getTime(),
        req.method + " " + req.url + " HTTP/" + req.httpVersion
      ];

      if(req.headers) {
        Object.keys(req.headers).forEach(function(key) {
          var val = req.headers[key];
          lines.push(key + ": " + val);
        });
      }

      return logger.hurl(lines.join('\n'));
    },
    enumerable: true
  },

  response: {
    value: function(res, options) {
      // logger.info('response', arguments);

      var lines = [
        'Response @ ' + new Date().getTime()
      ];

      // TODO: (IW) Parse the response

      return logger.hurl(lines.join('\n'));
    },
    enumerable: true
  }
});

module.exports = logger;
