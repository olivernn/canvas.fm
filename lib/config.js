var fs = require('fs'),
    path = require('path'),
    configPath = path.join(process.cwd(), 'config.json'),
    env = process.env.NODE_ENV || 'development',
    json = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = json[env]