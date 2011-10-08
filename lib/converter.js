var spawn = require('child_process').spawn,
    commandName = 'ffmpeg',
    commandOpts = ['-i', 'pipe:0', '-f', 'mp3', '-acodec', 'libvorbis', '-aq', '60', '-f', 'ogg', '-'];

var logOutput = function (data) {
  console.log(data.toString('ascii'))
}

var Converter = function () {
  this.process = spawn(commandName, commandOpts)
  this.process.stderr.on('data', logOutput)
}

Converter.create = function () {
  return new Converter ()
}

module.exports = Converter