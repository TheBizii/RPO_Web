const mysql = require('mysql')
const config = require('../config/config')

const connection = mysql.createConnection({
  host: config.serverIP,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
  port: config.dbPort
})

const getAllCountries = async function getAllCountries () {
  connection.connect()

  let response
  connection.query('SELECT * FROM country', function (error, results, fields) {
    if (error) {
      throw error
    }
    console.log(results[0])
    response = results[0]
  })

  connection.end()
  return response
}

export default {
  county: getAllCountries
}
