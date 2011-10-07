var spawn = require('child_process').spawn,
    commandName = 'ffmpeg',
    commandOpts = ['-i', 'pipe:0', '-f', 'mp3', '-acodec', 'libvorbis', '-aq', '60', '-f', 'ogg', '-'];

var callDataCallbacks = function (data) {
  this.dataCallbacks.forEach(function (fn) {
    fn(data)
  })
}

var callCompleteCallbacks = function (returnCode) {
  console.log('exited with', returnCode)
  this.completeCallbacks.forEach(function (fn) {
    fn(returnCode)
  })
  this.process.kill()
}

var setupTimeoutKill = function () {
  var self = this
  this.timeout = setTimeout(function () {
    self.kill()
  }, 60000)
}

var resetTimeoutKill = function () {
  clearTimeout(this.timeout)
  setupTimeoutKill.call(this)
}

var logOutput = function (data) {
  console.log(data.toString('ascii'))
}

var Converter = function () {
  this.dataCallbacks = []
  this.completeCallbacks = []
  this.process = spawn(commandName, commandOpts)
  this.process.stdout.on('data', callDataCallbacks.bind(this))
  this.process.stdout.on('data', resetTimeoutKill.bind(this))
  this.process.on('exit', callCompleteCallbacks.bind(this))
  this.process.stderr.on('data', logOutput)

  setupTimeoutKill.call(this)
}

Converter.create = function () {
  return new Converter ()
}

Converter.prototype = {

  send: function (data) {
    this.process.stdin.write(data, 'binary')
  },

  onData: function (fn) {
    this.dataCallbacks.push(fn)
  },

  onComplete: function (fn) {
    this.completeCallbacks.push(fn)
  },

  kill: function () {
    this.process.kill('SIGKILL')
  }
}

module.exports = Converter