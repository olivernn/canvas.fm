var express = require('express'),
    form = require('connect-form'),
    app = express.createServer(form({keepExtensions: true})),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    Converter = require('./lib/converter'),
    Track = require('./lib/track'),
    Resizer = require('./lib/resizer'),
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
  var track = Track.create({id: request.params['track_id']}),
      converter = Converter.create();

  response.contentType('application/ogg')

  track.stream(function (trackStream) {
    trackStream.pipe(converter.process.stdin)
    converter.process.stdout.pipe(response)
  })

  request.on('close', function () {
    track.stopStream()
    converter.kill()
    response.end()
  })
})

app.put('/tracks/:id', function (req, res) {
  var uploadDirName = path.join(process.cwd(), 'uploads')

  req.form.complete(function (err, fields, files) {
    var track = Track.create(fields)
    fs.rename(files.image.path, path.join(uploadDirName, req.params.id) + '.png', function (err) {
      if (err) console.log(err)
    })
    track.save(function () {
      res.end(JSON.stringify("{ok: true}"))
    })
    res.end()
  })
})

app.get('/tracks/:id/image/:size', function (req, res) {
  var track = Track.create({id: req.params.id}),
      resizer = Resizer.create(req.params.size);

  res.header('Cache-Control', 'public, max-age=2629743')

  track.openImage(function (imageStream) {
    imageStream.pipe(resizer.process.stdin)
    resizer.process.stdout.pipe(res)
  })
})

app.listen(3000)