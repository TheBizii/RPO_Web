const mysql = require('mysql')
const config = require('../config/config')

const connection = mysql.createConnection({
  host: config.serverIP,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
  port: config.dbPort
})

async function getAllCountries () {
  connection.connect()

  const results = connection.query('SELECT * FROM country')
  console.log('RESULTS: ' + results[0])

  connection.end()
  return results
}

module.exports = {
  getAllCountries: getAllCountries
}
