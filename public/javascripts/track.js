Track = (function () {

  SC.initialize({
    client_id: '3bf80245493b4d50ce93429b9b8cfacb'
  })

  var Track = function (attributes) {
    this.attributes = attributes
  }

  Track.find = function (id) {
    var deferred = new Deferred (),
        path = ['/tracks/', id].join('');

    // should look in some internal cache first!
    SC.get(path, function (data) {
      deferred.resolve(new Track (data))
    })

    return deferred
  }

  Track.search = function (q) {
    var deferred = new Deferred (),
        path = ['/tracks?q=', q].join('');

    SC.get(path, function (data) {
      deferred.resolve(data.map(function (attrs) {
        return new Track (attrs)
      }))
    })

    return deferred
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
    }
  }

  return Track
})()