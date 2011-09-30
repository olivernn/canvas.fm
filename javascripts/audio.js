var audio = (function () {

  var channels,
      rate,
      frameBufferLength,
      fft,
      elem,
      duration = 485.773061, // hardcoded for now!
      prevTime = 0,
      onSampleCallback = function () {};

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

    onSampleCallback(fft.spectrum, delta)
  }

  var onSample = function (fn) {
    onSampleCallback = fn
  }

  var init = function () {
    elem = document.getElementById('audio')
    elem.addEventListener('MozAudioAvailable', audioAvailable, false);
    elem.addEventListener('loadedmetadata', loadedMetaData, false);
  }

  return {
    init: init,
    onSample: onSample,
    duration: duration
  }
})()