const mysql = require('mysql')
const config = require('../config/config')

let connection
function connectToDB () {
  connection = mysql.createConnection({
    host: config.serverIP,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbDatabase,
    port: config.dbPort
  })
  connection.connect((err) => {
    if (err) {
      console.log('error when connecting to db:', err)
      setTimeout(connectToDB, 10000)
    }
  })
  connection.on('error', (err) => {
    console.log('db error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectToDB()
    } else {
      throw err
    }
  })
}

async function getAllCountries () {
  try {
    connectToDB()
    // console.log(connection)
    connection.connect()

    const results = connection.query('SELECT 1+2')
    console.log('RESULTS: ' + results[0])

    connection.end()
    return results
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getAllCountries: getAllCountries
}
