var http = require('http'),
    url = require('url'),
    clientId = '3bf80245493b4d50ce93429b9b8cfacb';

var optionsForRequest = function (trackId) {
  return {
    host: 'api.soundcloud.com',
    path: '/tracks/' + trackId + '/stream?client_id=' + clientId
  }
}

var optionsFromLocation = function (location) {
  return {
    host: location.host,
    path: location.pathname + location.search
  }
}

var get = function (trackId, fn) {
  http.get(optionsForRequest(trackId), function (res) {
    var location = url.parse(res.headers.location)

    http.get(optionsFromLocation(location), function (res) {
      res.on('data', fn)
    })
  })
}

exports.get = get