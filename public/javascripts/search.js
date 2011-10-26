search = (function () {

  var container, trackSelectedCallbacks = [], cachedTracks;

  var tracksAsJSON = function (track) {
    return track.asJSON()
  }

  var cacheResults = function (tracks) {
    cachedTracks = tracks
  }

  var closeSearchResults = function () {
    container.hide()
  }

  var displaySearchResults = function (tracks) {
    container
      .html(poirot.searchResults({
        tracks: tracks.map(tracksAsJSON)
      }))
      .show()

    $(window).one('keyup', function (e) {
      if (e.keyCode == 27) closeSearchResults()
    })
  }

  var trackSelected = function (e) {
    var selectedTrackId = $(this).data('track-id'),
        request = new Davis.Request({
          fullPath: '/tracks/' + selectedTrackId
        });

    Davis.location.assign(request)
    closeSearchResults()
  }

  var init = function () {
    container = $('#search-results-container')
    container.delegate('li', 'click', trackSelected)

    Track.bind('searchEnd', displaySearchResults)
    Track.bind('recents', closeSearchResults)
  }

  return {
    init: init
  }
})()