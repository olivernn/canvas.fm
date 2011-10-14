var http = require('http'),
    url = require('url'),
    db = require('./db.js').client,
    fs = require('fs'),
    path = require('path'),
    clientId = '3bf80245493b4d50ce93429b9b8cfacb';

var optionsForRequest = function (trackId) {
  return {
    host: 'api.soundcloud.com',
    path: '/tracks/' + trackId + '/stream?client_id=' + clientId,
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

var acceptableError = function (err) {
  if (err.number === 1062 && err.sqlState === '23000') return true
}

var Track = function (attributes) {
  this.attributes = attributes
}

Track.create = function (attributes) {
  return new Track (attributes)
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
    return this.attributes.artistName
  },

  openImage: function (cb) {
    var imagePath = path.join(process.cwd(), 'uploads', this.id() + '.png'),
        readStream = fs.createReadStream(imagePath)

    cb(readStream)
  },

  save: function (callback) {
    db.query("INSERT INTO tracks (id, title, artist_name, created_at) VALUES (?,?,?,?)", [this.id(), this.title(), this.artistName(), new Date ()], function (err, results) {
      if (err && !acceptableError(err)) throw("HUGE ERROR", err)
      callback()
    })
  }
}

module.exports = Track
