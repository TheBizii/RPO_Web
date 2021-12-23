const db = require('../../db')
const model = require('../model')
const Credentials = require('./credentials')

const Model = model.Model

class User extends Model {
  constructor () {
    super()
  }

  setFirstName (firstName) {
    this.firstName = firstName
  }

  setMiddleName (middleName) {
    this.middleName = middleName
  }

  setLastName (lastName) {
    this.lastName = lastName
  }

  setPhone (phone) {
    this.phone = phone
  }

  setCredentials (credentials) {
    if (credentials.constructor === Credentials) {
      this.credentials = credentials
    } else {
      throw new Error(`Got ${credentials.constructor}, expected object of type Credentials.`)
    }
  }

  addAddress (address) {
    if (this.addresses === undefined) {
      this.addresses = []
    }

    if (this.addresses.includes(address)) return
    this.addresses.push(address)
  }

  removeAddress (address) {
    if (this.addresses === undefined) return

    this.addresses = this.addresses.filter(addr => addr !== address)
  }

  addRole (role) {
    if (this.roles === undefined) {
      this.roles = []
    }

    if (this.roles.includes(role)) return

    this.roles.push(role)
  }

  removeRole (role) {
    if (this.roles === undefined) return

    this.roles = this.roles.filter(r => r !== role)
  }

  getFirstName () {
    return this.firstName
  }

  getMiddleName () {
    return this.middleName
  }

  getLastName () {
    return this.lastName
  }

  getPhone () {
    return this.phone
  }

  getCredentials () {
    return this.credentials
  }

  getAddresses () {
    return this.addresses
  }

  getRoles () {
    return this.roles
  }

  async create () {
    try {
      this.setActive(true)
      const sql = `INSERT INTO user (first_name, middle_name, last_name, phone, credentials_id, active) VALUES ("${this.getFirstName()}", "${this.getMiddleName()}", "${this.getLastName()}", "${this.getPhone()}", "${this.getCredentials().getID()}", 1);`
      const res = await db.query(sql)
      this.setID(res.insertId)

      for(let i = 0; i < this.getRoles().length; i++) {
        const rolesql = `INSERT INTO user_role (user_id, role_id, active) VALUES (${ this.getID() }, ${ this.getRoles()[i] }, 1);`;
        await db.query(rolesql);
      }
      return res
    } catch (err) {
      console.log(err)
    }
    return null
  }

  async read (id) {
    try {
      const sql = `SELECT * FROM user WHERE ID = ${id} AND active <> 0;`
      const res = await db.query(sql)
      if (res.length > 0) {
        const user = res[0]
        const credentials = new Credentials()
        await credentials.read(user.credentials_id)
        this.setID(user.ID)
        this.setFirstName(user.first_name)
        this.setMiddleName(user.middle_name)
        this.setLastName(user.last_name)
        this.setPhone(user.phone)
        this.setCredentials(credentials)
        this.setActive(user.active)

        // Load addresses
        const addressql = `SELECT address_id FROM customer_address WHERE user_id="${user.ID}" AND active <> 0;`
        const addressRes = await db.query(addressql)
        for (let i = 0; i < addressRes.length; i++) {
          this.addAddress(addressRes[i].address_id)
        }

        // Load roles
        const rolesql = `SELECT role_id FROM user_role WHERE user_id="${id}" AND active <> 0;`
        const rolesRes = await db.query(rolesql)
        for (let i = 0; i < rolesRes.length; i++) {
          this.addRole(rolesRes[i].role_id)
        }

        return this
      }
    } catch (err) {
      console.log(err)
    }
    return null
  }

  static async readByUsername (username) {
    try {
      const sql = `SELECT * FROM user u JOIN credentials c ON u.credentials_id = c.ID WHERE username = "${username}" AND u.active <> 0 AND c.active <> 0;`
      const res = await db.query(sql)
      if (res.length > 0) {
        const resUser = new User()
        const user = res[0]
        const credentials = new Credentials()
        await credentials.read(user.credentials_id)
        resUser.setID(user.ID)
        resUser.setFirstName(user.first_name)
        resUser.setMiddleName(user.middle_name)
        resUser.setLastName(user.last_name)
        resUser.setPhone(user.phone)
        resUser.setCredentials(credentials)
        resUser.setActive(user.active)

        // Load addresses
        const addressql = `SELECT address_id FROM customer_address WHERE user_id="${user.ID}" AND active <> 0;`
        const addressRes = await db.query(addressql)
        for (let i = 0; i < addressRes.length; i++) {
          resUser.addAddress(addressRes[i].address_id)
        }

        // Load roles
        const rolesql = `SELECT role_id FROM user_role WHERE user_id="${ user.ID }" AND active <> 0;`
        const rolesRes = await db.query(rolesql)
        for (let i = 0; i < rolesRes.length; i++) {
          resUser.addRole(rolesRes[i].role_id)
        }

        return resUser
      }
    } catch (err) {
      console.log(err)
    }
    return null
  }

  static async readAll () {
    try {
      const sql = 'SELECT ID FROM user WHERE active <> 0'
      const res = await db.query(sql)
      const users = []
      for (let i = 0; i < res.length; i++) {
        const user = new User()
        await user.read(res[i].ID)
        users.push(user)
      }
      return users
    } catch (err) {
      console.log(err)
    }
    return null
  }

  async update () {
    try {
      const sql = `UPDATE user SET first_name="${this.getFirstName()}", middle_name="${this.getMiddleName()}", last_name="${this.getLastName()}", phone="${this.getPhone()}", credentials_id="${this.getCredentials().getID()}", active="${this.getActive()}" WHERE ID=${this.getID()};`
      const res = await db.query(sql)

      // Check if any roles have to be deleted
      const rolesql = `SELECT role_id FROM user_role WHERE user_id="${this.getID()}" AND active <> 0;`
      const rolesRes = await db.query(rolesql)
      const rolesToRemove = []
      for (let i = 0; i < rolesRes.length; i++) {
        if (!this.roles.contains(rolesRes[i].role_id)) {
          rolesToRemove.push(rolesRes[i].role_id)
        }
      }

      if (rolesToRemove.length > 0) {
        const remrolesql = `UPDATE user_role SET active=0 WHERE role_id IN (${rolesToRemove.join()}) AND user_id=${this.getID()};`
        await db.query(remrolesql)
      }

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

module.exports = User
