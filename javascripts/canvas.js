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

  var init = function () {
    _cvas = document.getElementById('circle')
    ctx = _cvas.getContext('2d')
    ctx.translate(512, 512)
  }

  return {
    init: init,
    draw: draw,
    rotate: rotate
  }
})()