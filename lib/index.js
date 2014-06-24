var http = require('http'),
    proxy = require('http-proxy'),
    colors = require('colors'),
    logger = require('./logger'),
    Hurl;

//
// Expose version using `pkginfo`
//
require('pkginfo')(module, 'version');

//
// Hurl constructor
//
function Hurl( options ) {
  this.options = options || {};
}

//
// Hurl class properties
//
Object.defineProperties(Hurl.prototype, {
  validate: {
    value: function(options) {
      options || (options = this.options);
      return options.upstream && options.listen;
    }
  },
  start: {
    value: function() {
      var upstream = this.options.upstream,
          forward = this.options.forward,
          listen = this.options.listen,
          hurler;

      logger.info([
        "Hurling",
        ("localhost:" + listen).blue,
        "to",
        (upstream.host + ":" + upstream.port).blue,
        forward ? "and forwarding to " + (forward.host + ":" + forward.port).blue : ""
      ].join(' '));

      // Create proxy server
      hurler = proxy
        .createServer(this.options, function (req, res, prox) {
          var buffer = proxy.buffer(req);

          // Proxy to upstream host
          prox.proxyRequest(req, res, {
            host: upstream.host,
            port: upstream.port,
            buffer: buffer
          });
        });

      // Log the request when the proxy request is done
      hurler.proxy.on('end', function(req, res) {
        logger.info('request', req);

        // Log request
        logger.request(req);
        // Log response
        logger.response(res);
      });

      // On proxy data
      hurler.proxy.on('data', function() {
        console.log('proxy data', arguments);
      });

      // Start listening for requests
      hurler.listen(listen);
    },
    enumerable: true
  }
});

exports.Hurl = Hurl;
exports.start = function (options) {
  return new Hurl(options).start();
};
