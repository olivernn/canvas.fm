var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    Converter = require('./lib/converter'),
    track = require('./lib/track'),
    pathRegex = /^\/stream\/(\d+)/;

http.createServer(function (req, res) {

  var respondWith404 = function () {
    res.writeHead(404, {"Content-Type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
  }

  var matcher = pathRegex.exec(req.url)

  if (!matcher) return respondWith404()

  var trackId = matcher[1]

  res.writeHead(200, {"Content-Type": "application/ogg"})

  var converter = Converter.create()
  
  track.get(trackId, function (data) {
    converter.send(data)
  })

  converter.onData(function (data) {
    res.write(data, 'binary')
  })

  converter.onComplete(function () {
    res.end()
  })

}).listen(8004)