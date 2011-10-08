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

  var reset = function () {
    ctx.restore()
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,1024,1024)
  }

  var init = function () {
    _canvas = document.getElementById('circle')
    ctx = _canvas.getContext('2d')
    ctx.translate(512, 512)
    ctx.rotate(Math.PI)
    ctx.save()
  }

  return {
    init: init,
    draw: draw,
    rotate: rotate,
    toPng: toPng,
    reset: reset
  }
})()