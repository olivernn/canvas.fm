var mysql = require('mysql'),
    config = require('./config.js'),
    client = mysql.createClient({
      user: config.database.user,
      password: config.database.password
    })

client.useDatabase(config.database.name)

exports.client = client