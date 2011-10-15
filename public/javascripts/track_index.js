trackIndex = (function () {

  var container

  var displayRecentTracks = function (tracks) {
    container.show().html(poirot.trackIndex({
      tracks: tracks.map(function (track) { return track.asJSON() })
    }))
  }

  var hideRecentTracks = function () {
    container.hide()
  }

  var selectTrack = function () {
    var selectedTrackId = $(this).data('track-id'),
        request = new Davis.Request({
          fullPath: '/tracks/' + selectedTrackId
        });

    Davis.location.assign(request)
  }

  var init = function () {
    container = $("#track-index")

    container.delegate('li', 'click', selectTrack)

    Track.bind('recents', displayRecentTracks)
    Track.bind('loaded', hideRecentTracks)
  }

  return {
    init: init
  }
})()