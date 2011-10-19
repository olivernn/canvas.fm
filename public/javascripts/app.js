var app = Davis(function () {

  this.get('/', function (req) {
    Track.recent()
  })

  this.get('/search', function (req) {
    Track.search(req.params['query'])
  })

  this.get('/tracks/:track_id', function (req) {
    Track.load(req.params['track_id'])
  })

  this.bind('start', function () {
    audio.init()
    canvas.init()
    search.init()
    trackControls.init()
    trackIndex.init()
    spinner.init()
  })
})

app.start()