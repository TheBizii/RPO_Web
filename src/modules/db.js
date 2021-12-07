const mysql = require('mysql')
const { promisify } = require('util')
const config = require('../config/config')

let connection
async function connectToDB () {
  connection = await mysql.createConnection({
    host: config.serverIP,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbDatabase,
    port: config.dbPort
  })
  /* connection.connect((err) => {
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
  }) */
}

async function getAllCountries () {
  try {
    const res = []
    await connectToDB()
    const query = await promisify(connection.query).bind(connection)
    const result = await query('SELECT * FROM country')
    const keys = Object.keys(result)
    for (let i = 0; i < keys.length; i++) {
      res.push([keys[i], result[keys[i]]])
    }
    console.log(JSON.stringify(res))
    connection.end()
    return res || 'Non valid data'
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getAllCountries: getAllCountries
}
