var spawn = require('child_process').spawn,
    commandName = 'ffmpeg',
    commandOpts = ['-i', 'pipe:0', '-f', 'mp3', '-acodec', 'libvorbis', '-aq', '60', '-f', 'ogg', '-'];

var logOutput = function (data) {
  console.log(data.toString('ascii'))
}

var Converter = function () {
  this.process = spawn(commandName, commandOpts)
  this.process.stderr.on('data', logOutput)

  this.process.stdin.on('error', function (err) {
    console.log('converter stdin error', err)
  })

  this.process.stdout.on('error', function (err) {
    console.log('converter stdout error', err)
  })
}

Converter.create = function () {
  return new Converter ()
}

module.exports = Converter

Converter.prototype = {
  kill: function () {
    this.process.stdin.destroy()
    this.process.stdout.destroy()
    this.process.kill('SIGKILL')
  }
}