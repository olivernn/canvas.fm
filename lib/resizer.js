var spawn = require('child_process').spawn,
    commandName = 'convert';

var sizes = {
  'small': '100x100',
  'medium': '300x300',
  'large': '800x800'
}

var commandOpts = function (size) {
  return ['-', '-thumbnail', sizes[size], '-']
}

var Resizer = function (size) {
  this.size = size

  this.process = spawn(commandName, commandOpts(size))

  this.process.stdin.on('error', function (err) {
    console.log('resizer stdin error', err)
  })

  this.process.stdout.on('error', function (err) {
    console.log('resizer stdout error', err)
  })
}

Resizer.create = function (size) {
  return new Resizer (size)
}

module.exports = Resizer

Resizer.prototype = {
  kill: function () {
    this.process.stdin.destroy()
    this.process.stdout.destroy()
    this.process.kill('SIGKILL')
  }
}