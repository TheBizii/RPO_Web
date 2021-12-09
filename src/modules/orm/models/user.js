const db = require('../../db');
const model = require('../model');

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

  // TODO: addAddress, removeAddress

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
      let sql = `INSERT INTO user (first_name, middle_name, last_name, phone, active) VALUES ("${ this.getFirstName() }", "${ this.getMiddleName() }", "${ this.getLastName() }", "${ this.getPhone() }", 1);`;
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
        this.setID(user.ID);
        this.setFirstName(user.first_name);
        this.setMiddleName(user.middle_name);
        this.setLastName(user.last_name);
        this.setPhone(user.phone);
        // TODO: Load addresses
        this.setActive(user.active);
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
      let sql = `UPDATE user SET first_name="${ this.getFirstName() }", middle_name="${ this.getMiddleName() }", last_name="${ this.getLastName() }", phone="${ this.getPhone() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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
