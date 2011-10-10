var express = require('express'),
    app = express.createServer(),
    util = require('util'),
    Converter = require('./lib/converter'),
    Track = require('./lib/track'),
    pathRegex = /^\/stream\/(\d+)/,
    sendMainPage = function (req, res) {
      res.sendfile(__dirname + '/views/main.html')
    };

app.configure(function () {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger({
    'format': ':method :url :status - :response-time ms'
  }))
  app.use(app.router);
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', sendMainPage)
app.get('/tracks/:id', sendMainPage)
app.get('/search', sendMainPage)

app.get('/stream/:track_id', function (request, response) {
  var track = Track.create(request.params['track_id']),
      converter = Converter.create();

  response.contentType('application/ogg')

  track.get(function (trackStream) {
    trackStream.pipe(converter.process.stdin)
    converter.process.stdout.pipe(response)
  })

  request.on('close', function () {
    track.stop()
    converter.kill()
    response.end()
  })
})

app.put('/tracks/:id', function (req, res) {

})

app.listen(3000)