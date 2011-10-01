var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    spawn = require('child_process').spawn,
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

  var converter = spawn('ffmpeg', ['-i', 'pipe:0', '-f', 'mp3', '-acodec', 'libvorbis', '-aq', '60', '-f', 'ogg', '-'])

  res.writeHead(200, {"Content-Type": "application/ogg"})

  converter.stdout.on('data', function (data) {
    res.write(data, 'binary')
  })

  converter.stderr.on('data', function (data) {
    console.log(data.toString('ascii'))
  })

  converter.on('exit', function (code) {
    console.log('exited with code', code)
    res.end()
  })

  var options = {
    host: "api.soundcloud.com",
    path: "/tracks/" + trackId + "/stream?client_id=3bf80245493b4d50ce93429b9b8cfacb"
  }

  var apiRequest = http.get(options, function (res) {
    var location = url.parse(res.headers.location)

    var redirect = http.get({
      host: location.host,
      path: location.pathname + location.search
    }, function (res) {
      res.on('data', function (data) {
        converter.stdin.write(data, 'binary')
      })
    })
  })

}).listen(8004)