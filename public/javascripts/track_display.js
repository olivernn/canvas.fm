trackDisplay = (function () {

  var loadTrack = function (track) {
    var container = $('#track-display-container')
    console.log(track.asJSON())
    container.html(poirot.trackDisplay(track.asJSON()))
  }

  return {
    loadTrack: loadTrack
  }
})()