const db = require('../../db');
const model = require('../model');
const Credentials = require('./credentials');

const Model = model.Model;

class User extends Model {
  constructor() {
    super();
  }

  setFirstName(firstName) {
    this.firstName = firstName;
  }

  setMiddleName(middleName) {
    this.middleName = middleName;
  }

  setLastName(lastName) {
    this.lastName = lastName;
  }

  setPhone(phone) {
    this.phone = phone;
  }

  setCredentials(credentials) {
    if(credentials.constructor === Credentials) {
      this.credentials = credentials;
    } else {
      throw new Error(`Got ${credentials.constructor}, expected object of type Credentials.`);
    }
  }
  
  addAddress(address) {
    if(this.addresses === undefined) {
      this.addresses = [];
    }

    if(this.addresses.includes(address)) return;
    this.addresses.push(address);
  }

  removeAddress(address) {
    if(this.addresses === undefined) return;

    this.addresses = this.addresses.filter(addr => addr !== address);
  }

  getFirstName() {
    return this.firstName;
  }

  getMiddleName() {
    return this.middleName;
  }

  getLastName() {
    return this.lastName;
  }

  getPhone() {
    return this.phone;
  }

  // NOTE: This is table customer_addresses
  getAddresses() {
    return this.addresses;
  }

  async create() {
    try {
      this.setActive(true); 
      let sql = `INSERT INTO user (first_name, middle_name, last_name, phone, credentials_id, active) VALUES ("${ this.getFirstName() }", "${ this.getMiddleName() }", "${ this.getLastName() }", "${ this.getPhone() }", "${ this.getCredentials().getID() }", 1);`;
      let res = await db.query(sql);
      this.setID(res.insertId);
      return res;
    } catch(err) {
      console.log(err);
    }
    return null;
  }

  async read(id) {
    try {
      let sql = `SELECT * FROM user WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let user = res[0];
        let credentials = new Credentials();
        await credentials.read(user.credentials_id);
        this.setID(user.ID);
        this.setFirstName(user.first_name);
        this.setMiddleName(user.middle_name);
        this.setLastName(user.last_name);
        this.setPhone(user.phone);
        this.setCredentials(credentials);
        this.setActive(user.active);

        // Load addresses
        let addressql = `SELECT address_id FROM customer_address WHERE user_id="${ user.ID }" AND active <> 0;`;
        let addressRes = await db.query(addressql);
        for(let i = 0; i < addressRes.length; i++) {
          this.addAddress(addressRes[i].address_id);
        }
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM user WHERE active <> 0`;
      let res = await db.query(sql); 
      let users = [];
      for(let i = 0; i < res.length; i++) {
        let user = new User();
        await user.read(res[i].ID);
        users.push(user);
      }
      return users;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE user SET first_name="${ this.getFirstName() }", middle_name="${ this.getMiddleName() }", last_name="${ this.getLastName() }", phone="${ this.getPhone() }", credentials_id="${ this.getCredentials().getID() }" active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);
      return JSON.stringify(res);
    } catch(err) {
      console.log(err);
    }
  }

  async del() {
    this.setActive(false);
    await this.update();
  }
}

module.exports = User;
