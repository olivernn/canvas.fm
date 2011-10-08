var express = require('express'),
    app = express.createServer(),
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

app.get('/stream/:track_id', function (req, res) {
  var track = Track.create(req.params['track_id']),
      converter = Converter.create();

  res.contentType('application/ogg')

  track.get(function (data) {
    converter.send(data)
  })

  converter.onData(function (data) {
    res.write(data)
  })

  converter.onComplete(function () {
    res.end()
  })
})

app.put('/track/:id', function (req, res) {
  
})

app.listen(3000)