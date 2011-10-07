var canvas = (function () {

  var _canvas, ctx, intensity

  var rotate = function (rad) {
    ctx.rotate(rad)
  }

  var draw = function (sample) {
    for (var i=0; i < sample.length; i++) {
      intensity = sample[i] * 10
      ctx.fillStyle = 'rgba(0,0,0, ' + intensity + ')'
      ctx.fillRect(512 - i, 0, 1, 1)
    };
  }

  var toPng = function () {
    return _canvas.toDataURL('image/png')
  }

  var init = function () {
    _canvas = document.getElementById('circle')
    ctx = _canvas.getContext('2d')
    ctx.translate(512, 512)
  }

  return {
    init: init,
    draw: draw,
    rotate: rotate,
    toPng: toPng
  }
})()