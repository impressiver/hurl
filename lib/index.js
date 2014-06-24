var http   = require('http'),
    httpProxy  = require('http-proxy'),
    colors = require('colors'),
    logger = require('./logger'),
    pkg    = require('../package.json'),
    Hurl;

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
      return (options.target && options.listen);
    }
  },
  start: {
    value: function() {
      var target = this.options.target,
          forward = this.options.forward,
          listen = this.options.listen,
          server, proxy;

      // Output proxy configiration
      // --------------------------
      
      logger.info([
        "Hurling",
        ("localhost:" + listen).green,
        "to",
        (target.host + ":" + target.port).green,
        forward ? "and forwarding to " + (forward.host + ":" + forward.port).orange : ""
      ].join(' '));


      // Create servers
      // --------------

      // Create proxy server
      proxy = httpProxy.createServer(this.options);

      // Create listening server
      server = http.createServer(function(req, res) {
        // logger.info('Proxying request', req);
        proxy.web(req, res, this.options);
      });


      // Proxy event handlers
      // --------------------

      // Log the request/response when the proxy request is done
      proxy.on('end', function(req, res) {
        // logger.info('proxy end', arguments);

        // Log request/response
        logger.request(req);
        logger.response(res);
      });

      proxy.on('proxyRes', function (res) {
        // logger.info('proxy proxyRes', arguments);
        // logger.info('Raw response (from the target)', JSON.stringify(res.headers, true, 2));
      });

      // On proxy data
      proxy.on('data', function() {
        // logger.info('proxy data', arguments);
      });

      // On proxy error
      proxy.on('error', function(err, req, res) {
        // logger.info('proxy error', arguments);
      });


      // Server event handlers
      // ---------------------

      server.on('end', function() {
        // logger.info('server end', arguments);
      });

      server.on('data', function() {
        // logger.info('server data', arguments);
      });

      server.on('error', function() {
        // logger.info('server error', arguments);
      });


      // Start the server
      // ----------------
      
      server.listen(listen);
    },
    enumerable: true
  }
});

exports.Hurl = Hurl;
exports.start = function (options) {
  return new Hurl(options).start();
};
exports.version = pkg.version;
