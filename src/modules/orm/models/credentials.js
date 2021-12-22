const db = require('../../db')
const model = require('../model')

const Model = model.Model

class Credentials extends Model {
  constructor () {
    super()
  }

  setUsername (username) {
    this.username = username
  }

  setPassword (password) {
    this.password = password
  }

  setSalt (salt) {
    this.salt = salt
  }

  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }

  getSalt() {
    return this.salt;
  }

  async create () {
    try {
      this.setActive(true)
      const sql = `INSERT INTO credentials (username, password, salt, active) VALUES ("${this.getUsername()}", "${this.getPassword()}", "${this.getSalt()}", 1);`
      const res = await db.query(sql)
      this.setID(res.insertId)
      return res
    } catch (err) {
      console.log(err)
    }
    return null
  }

  async read (id) {
    try {
      const sql = `SELECT * FROM credentials WHERE ID = ${id} AND active <> 0;`
      const res = await db.query(sql)
      if (res.length > 0) {
        const credentials = res[0]
        this.setID(credentials.ID)
        this.setUsername(credentials.username)
        this.setPassword(credentials.password)
        this.setSalt(credentials.salt)
        this.setActive(credentials.active)
        return this
      }
    } catch (err) {
      console.log(err)
    }

    return null
  }

  async readByUsername (username) {
    try {
      const sql = `SELECT * FROM credentials WHERE username = ${username} AND active <> 0;`
      const res = await db.query(sql)
      if (res.length > 0) {
        const credentials = res[0]
        this.setID(credentials.ID)
        this.setUsername(credentials.username)
        this.setPassword(credentials.password)
        this.setSalt(credentials.salt)
        this.setActive(credentials.active)
        return this
      }
    } catch (err) {
      console.log(err)
    }
    return null
  }

  static async readAll () {
    try {
      const sql = 'SELECT ID FROM credentials WHERE active <> 0'
      const res = await db.query(sql)
      const allCredentials = []
      for (let i = 0; i < res.length; i++) {
        const credentials = new Credentials()
        await credentials.read(res[i].ID)
        allCredentials.push(credentials)
      }
      return allCredentials
    } catch (err) {
      console.log(err)
    }

    return null
  }

  async update () {
    try {
      const sql = `UPDATE credentials SET username="${this.getUsername()}", password="${this.getPassword()}", salt="${this.getSalt()}", active="${this.getActive()}" WHERE ID=${this.getID()};`
      const res = await db.query(sql)
      return JSON.stringify(res)
    } catch (err) {
      console.log(err)
    }
  }

  async del () {
    this.setActive(false)
    await this.update()
  }
}

module.exports = Credentials
