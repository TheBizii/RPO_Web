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
    connection.end()
    return JSON.stringify(res) || 'Non valid data'
  } catch (err) {
    console.log(err)
  }
}

async function confirmLoginInformation (email, password) {
  try {
    const res = []
    await connectToDB()
    const query = await promisify(connection.query).bind(connection)
    const result = await query(`SELECT * FROM credentials WHERE email = "${email}" AND password = "${password}" AND active = 1`)
    if (result.length !== 1) {
      return null
    }
    return JSON.stringify(res)
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getAllCountries,
  confirmLoginInformation
}
