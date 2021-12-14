const db = require('../../db');
const model = require('../model');

const Model = model.Model;

class Credentials extends Model {
  constructor() {
    super();
  }

  setEmail(email) {
    this.email = email;
  }

  setPassword(password) {
    this.password = password;
  }

  setSalt(salt) {
    this.salt = salt;
  }

    async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO credentials (email, password, salt, active) VALUES ("${ this.getEmail() }", "${ this.getPassword() }", "${ this.getSalt() }", 1);`;
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
      let sql = `SELECT * FROM credentials WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let credentials = res[0];
        this.setID(credentials.ID);
        this.setEmail(credentials.email);
        this.setPassword(credentials.password);
        this.setSalt(credentials.salt);
        this.setActive(credentials.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM credentials WHERE active <> 0`;
      let res = await db.query(sql);
      let allCredentials = [];
      for(let i = 0; i < res.length; i++) {
        let credentials = new Credentials();
        await credentials.read(res[i].ID);
        allCredentials.push(credentials);
      }
      return allCredentials;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE credentials SET email="${ this.getEmail() }", password="${ this.getPassword() }", salt="${ this.getSalt() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Credentials;
