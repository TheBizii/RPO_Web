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
    if (result.length === 0) {
      return null
    }
    return JSON.stringify(res)
  } catch (err) {
    console.log(err)
  }
}

async function getAllShops () {
  try {
    await connectToDB()
    const query = await promisify(connection.query).bind(connection)
    const result = await query('SELECT a.id, a.address, a.coordinate, pl.title, p.city_name as city, c.name as country FROM address a JOIN partner_location pl ON pl.address_id = a.ID JOIN post p ON a.post_id = p.ID JOIN country c ON p.country_id = c.ID')
    if (result.length === 0) {
      return null
    }
    return JSON.stringify(result)
  } catch (err) {
    console.log(err)
  }
}

async function updateCoordinates (id, lat, lng) {
  try {
    await connectToDB()
    const query = await promisify(connection.query).bind(connection)
    const result = await query(`UPDATE address SET coordinate = POINT(${lat}, ${lng}) WHERE ID = ${id}`)
    if (result.length === 0) {
      return null
    }
    return JSON.stringify(result)
  } catch (err) {
    console.log(err)
  }
}

async function query (qry) {
  try {
    await connectToDB()
    const query = await promisify(connection.query).bind(connection)
    const result = await query(qry)
    return result
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getAllCountries,
  confirmLoginInformation,
  getAllShops,
  updateCoordinates,
  query
}
