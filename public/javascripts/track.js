Track = (function () {

  SC.initialize({
    client_id: '3bf80245493b4d50ce93429b9b8cfacb'
  })

  var Track = function (attributes) {
    this.attributes = attributes
    this._callbacks = {}
  }

  Track.load = function (id) {
    var deferred = new Deferred (),
        path = ['/tracks/', id].join('');

    // should look in some internal cache first!
    SC.get(path, function (data) {
      var track = new Track (data)

      Track.trigger('loaded', track)
      deferred.resolve(track)
    })

    return deferred
  }

  Track.search = function (q) {
    var deferred = new Deferred (),
        path = ['/tracks?q=', q].join('');

    SC.get(path, function (data) {
      var tracks = data.map(function (attrs) { return new Track (attrs) })

      Track.trigger('searched', tracks)
      deferred.resolve(tracks)
    })

    return deferred
  }

  Track._callbacks = {}

  Track.bind = function (eventName, fn) {
    this._callbacks[eventName] = this._callbacks[eventName] || []
    this._callbacks[eventName].push(fn)
  }

  Track.trigger = function (eventName, data) {
    Array.wrap(this._callbacks[eventName]).forEach(function (callback) {
      callback(data)
    })
  }

  Track.prototype = {
    asJSON: function () {
      return $.extend({}, this.attributes, {
        artistName: this.artistName(),
        artworkUrl: this.artworkUrl()
      })
    },

    artistName: function () {
      return this.attributes.user.username
    },

    id: function () {
      return this.attributes.id
    },

    title: function () {
      return this.attributes.title
    },

    src: function () {
      return ['/stream/', this.id()].join('')
    },

    duration: function () {
      return this.attributes.duration / 1000
    },

    artworkUrl: function () {
      if (this.attributes.artwork_url) {
        return this.attributes.artwork_url
      } else {
        return '/images/missing_artwork.png'
      };
    },

    fullTitle: function () {
      return [this.attributes.title, this.artistName].join(' - ')
    },

    play: function () {
      Array.wrap(this._callbacks.play).forEach(function (cb) { cb() })
    },

    pause: function () {
      Array.wrap(this._callbacks.paused).forEach(function (cb) { cb() })
    },

    bind: function (eventName, cb) {
      Track.bind.call(this, eventName, cb)
    },

    image: function (blob) {
      if (blob) this.attributes.blob = blob
      return this.attributes.blob
    },

    toFormData: function () {
      var self = this
      return ['id', 'title', 'artistName', 'image'].reduce(function (data, attrName) {
        data.append(attrName, self[attrName]())
        return data
      }, new FormData ())
    },

    save: function () {
      var deferred = new Deferred ()

      xhr.put('/tracks/' + this.id(), {data: this.toFormData()}, function () {
        console.log('done')
      })

      return deferred
    }
  }

  return Track
})()