Hurl (for now)
==============

A simple debugging proxy that accepts HTTP requests, logs them, and forwards
to the original destination. It makes debugging server-server API requests a
little bit easier.

Todo
-----
- [ ]  Fully implement request/response parsers 
- [ ]  Log raw http format to make re-running requests simple 
- [ ]  Web console

Usage
-----
```
$ node bin/hurl.js -h

  Usage: hurl hostname:port [options]

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -l, --listen <port>            port to listen for incoming requests (default: 8000)
    -t, --timeout <ms>             proxy timeout in milliseconds (default: 120000)
    -f, --forward <hostname:port>  forward requests to an additional destination
    -x, --extra                    enable x-headers (x-forwarded-for, x-forwarded-port, x-forwarded-proto)
    -ws, --web-sockets             enable WebSockets proxy
```

