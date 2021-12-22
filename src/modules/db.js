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

async function query (qry) {
  try {
    const query = await promisify(connection.query).bind(connection)
    const result = await query(qry)
    return result
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  connectToDB,
  query
}
