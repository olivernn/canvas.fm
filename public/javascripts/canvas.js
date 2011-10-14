var canvas = (function () {

  var _canvas, ctx, intensity

  var rotate = function (rad) {
    ctx.rotate(rad)
  }

  var draw = function (sample) {
    for (var i=0; i < sample.length; i++) {
      intensity = sample[i] * 10
      ctx.fillStyle = 'rgba(0,0,0, ' + intensity + ')'
      ctx.fillRect(0, 512 - i, 1, 1)
    };
  }

  var toPng = function () {
    return _canvas.toDataURL('image/png')
  }

  var toBlob = function () {
    var dataURI = toPng()
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new MozBlobBuilder();
    bb.append(ab);
    return bb.getBlob(mimeString);
  }

  var reset = function () {
    _canvas.width = _canvas.width
    ctx.translate(512, 512)
    ctx.rotate(Math.PI)
  }

  var init = function () {
    _canvas = document.getElementById('circle')
    ctx = _canvas.getContext('2d')
    ctx.translate(512, 512)
    ctx.rotate(Math.PI)
  }

  return {
    init: init,
    draw: draw,
    rotate: rotate,
    toPng: toPng,
    toBlob: toBlob,
    reset: reset
  }
})()