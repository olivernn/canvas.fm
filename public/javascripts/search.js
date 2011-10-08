search = (function () {

  var container, trackSelectedCallbacks = [], cachedTracks;

  var tracksAsJSON = function (track) {
    return track.asJSON()
  }

  var cacheResults = function (tracks) {
    cachedTracks = tracks
  }

  var displaySearchResults = function (tracks) {
    container
      .html(poirot.searchResults({
        tracks: tracks.map(tracksAsJSON)
      }))
      .show()
  }

  var trackSelected = function (e) {
    var selectedTrackId = $(this).data('track-id'),
        request = new Davis.Request({
          fullPath: '/tracks/' + selectedTrackId
        });

    Davis.location.assign(request)
    container.hide()
  }

  var init = function () {
    container = $('#search-results-container')
    container.delegate('li', 'click', trackSelected)
  }

  return {
    init: init,
    displayTracks: displaySearchResults,
  }
})()