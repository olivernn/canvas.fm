search = (function () {

  var elem, container, trackSelectedCallbacks = [], cachedTracks;

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

  var performSearch = function (e) {
    e.preventDefault()
    Track.search(elem.find('#search-input').val())
      .then(cacheResults)
      .then(displaySearchResults)
  }

  var onTrackSelected = function (fn) {
    trackSelectedCallbacks.push(fn)
  }

  var trackSelected = function (e) {
    var selectedTrackId = $(this).data('track-id'),
        selectedTrack = cachedTracks.detect(function (track) {
          return track.id() == selectedTrackId
        })

    container.hide()

    trackSelectedCallbacks.forEach(function (callback) {
      callback.call(selectedTrack, selectedTrack)
    })
  }

  var init = function () {
    elem = $('#search')
    elem.bind('submit', performSearch)
    container = $('#search-results-container')
    container.delegate('li', 'click', trackSelected)
  }

  return {
    init: init,
    onTrackSelected: onTrackSelected
  }
})()