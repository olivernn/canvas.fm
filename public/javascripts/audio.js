var audio = (function () {

  var channels,
      rate,
      frameBufferLength,
      fft,
      elem,
      _duration,
      prevTime = 0,
      currentTrack;

  var loadedMetaData = function () {
    channels = elem.mozChannels
    rate = elem.mozSampleRate
    frameBufferLength = elem.mozFrameBufferLength

    fft = new FFT (frameBufferLength / channels, rate)
  }

  var audioAvailable = function (event) {
    var frameBuffer = event.frameBuffer,
        time = event.time,
        signal = new Float32Array(frameBuffer.length / channels),
        delta = time - prevTime;

    prevTime = time

    for (var i=0, fbl = frameBufferLength / 2; i < fbl; i++) {
      signal[i] = (frameBuffer[2*i] + frameBuffer[2*i+1]) / 2
    };

    fft.forward(signal)

    canvas.rotate((delta / currentTrack.duration()) * (Math.PI * 2))
    canvas.draw(fft.spectrum)
  }

  var play = function () {
    elem.play()
  }

  var pause = function () {
    elem.pause()
  }

  var pauseAndHide = function () {
    pause()
    canvas.hide()
  }

  var loadTrack = function (track) {
    currentTrack = track
    prevTime = 0
    elem.src = currentTrack.src()

    canvas.reset()

    currentTrack.bind('play', play)
    currentTrack.bind('paused', pause)

    currentTrack.play()
  }

  var audioEnded = function () {
    currentTrack.image(canvas.toBlob())
    currentTrack.save()
  }

  var init = function () {
    elem = document.getElementById('audio')
    elem.addEventListener('MozAudioAvailable', audioAvailable, false);
    elem.addEventListener('loadedmetadata', loadedMetaData, false);
    elem.addEventListener('ended', audioEnded, false)

    Track.bind('loaded', loadTrack)
    Track.bind('recents', pauseAndHide)
  }

  return {
    init: init,
    play: play,
    pause: pause
  }
})()