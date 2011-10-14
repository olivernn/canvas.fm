var mysql = require('mysql'),
    client = mysql.createClient({
      user: 'root',
      password: ''
    })

client.useDatabase('canvas_fm_dev')

exports.client = client