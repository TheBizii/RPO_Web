const db = require('../../db');
const model = require('../model');

const Model = model.Model;

class Role extends Model {
  constructor() {
    super();
  }

  setType(type) {
    this.type = type;
  }

  getType() {
    return this.type;
  }

  async create() {
    try {
      this.setActive(true); 
      let sql = `INSERT INTO role (type, active) VALUES ("${ this.getType() }", 1);`;
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
      let sql = `SELECT * FROM role WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let role = res[0];
        this.setID(role.ID);
        this.setType(role.type);
        this.setActive(role.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM role WHERE active <> 0`;
      let res = await db.query(sql); 
      let roles = [];
      for(let i = 0; i < res.length; i++) {
        let role = new Role();
        await role.read(res[i].ID);
        roles.push(role);
      }
      return roles;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE role SET type="${ this.getType() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Role;
