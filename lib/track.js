var http = require('http'),
    url = require('url'),
    db = require('./db.js').client,
    fs = require('fs'),
    path = require('path'),
    config = require('./config.js');

var optionsForRequest = function (trackId) {
  return {
    host: 'api.soundcloud.com',
    path: '/tracks/' + trackId + '/stream?client_id=' + config.soundcloud_api_key,
    headers: {
      'User-Agent': 'node.js'
    }
  }
}

var optionsFromLocation = function (location) {
  return {
    host: location.host,
    path: location.pathname + location.search,
    headers: {
      'User-Agent': 'node.js'
    }
  }
}

var Track = function (attributes, image) {
  this.attributes = attributes
  this.image = image
}

Track.create = function (attributes, files) {
  return new Track (attributes, files && files.image)
}

Track.recent = function (cb) {
  db.query('SELECT * FROM tracks ORDER BY updated_at DESC LIMIT 12', function (err, results) {
    if (err) cb(err)
    cb(null, results.map(function (raw) {
      return Track.create(raw)
    }))
  })
}

Track.prototype = {
  stream: function (fn) {
    var self = this
    http.get(optionsForRequest(this.id()), function (res) {
      var location = url.parse(res.headers.location)
      self.request = http.get(optionsFromLocation(location), function (res) {
        fn(res)
      })
    })
  },

  stopStream: function () {
    this.request && this.request.destroy()
  },

  id: function () {
    return this.attributes.id
  },

  title: function () {
    return this.attributes.title
  },

  artistName: function () {
    return this.attributes.artistName || this.attributes.artist_name
  },

  asJSON: function () {
    return {
      id: this.id(),
      title: this.title(),
      artistName: this.artistName()
    }
  },

  openImage: function (cb) {
    var readStream = fs.createReadStream(this.imagePath())
    cb(readStream)
  },

  imagePath: function () {
    return path.join(__dirname, '..', 'uploads', this.id() + '.png')
  },

  save: function (callback) {
    var self = this

    db.query("INSERT INTO tracks (id, title, artist_name, created_at, updated_at) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE play_count = play_count + 1", [self.id(), self.title(), self.artistName(), new Date (), new Date ()], function (err, results) {
      if (err) return callback(err)

      fs.rename(self.image.path, self.imagePath(), function (err) {
        if (err) return callback(err)

        callback(null, 'success')
      })
    })
  }
}

module.exports = Track
