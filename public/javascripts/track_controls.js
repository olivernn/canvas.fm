trackControls = (function () {

  var container, elem, currentTrack

  var loadTrack = function (track) {
    currentTrack = track
    elem = poirot.trackControls(track.asJSON())
    container.html(elem)
  }

  var playClicked = function (e) {
    e.preventDefault()

    $(this)
      .removeClass('play')
      .addClass('pause')
      .attr('title', 'pause track')

    currentTrack.play()
  }

  var pauseClicked = function (e) {
    e.preventDefault()

    $(this)
      .removeClass('pause')
      .addClass('play')
      .attr('title', 'play track')

    currentTrack.pause()
  }

  var downloadClicked = function () {
    var link = $(this)
    link.attr('href', canvas.toPng())
    link.attr('title', currentTrack.fullTitle())
  }

  var init = function () {
    container = $("#track-controls-container")
    container
      .delegate('.play', 'click', playClicked)
      .delegate('.pause', 'click', pauseClicked)
      .delegate('.download', 'click', downloadClicked)

    Track.bind('loaded', loadTrack)
  }

  return {
    init: init,
    loadTrack: loadTrack
  }
})()