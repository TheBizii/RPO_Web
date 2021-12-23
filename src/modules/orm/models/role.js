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

  addUser(user) {
    if (this.users === undefined) {
      this.users = [];
    }

    if (this.users.includes(user)) return;

    this.users.push(user);
  }

  removeUser(user) {
    if (this.users === undefined) return;

    this.users = this.users.filter(u => u !== user);
  }

  getType() {
    return this.type;
  }

  getUsers() {
    return this.users;
  }

  async create() {
    try {
      this.setActive(true); 
      let sql = `INSERT INTO role (type, active) VALUES ("${ this.getType() }", 1);`;
      let res = await db.query(sql);
      this.setID(res.insertId);

      for(let i = 0; i < this,getUsers().length; i++) {
        const usersql = `INSERT INTO user_role (user_id, role_id, active) VALUES (${ this.getUsers()[i] }, ${ this.getID() }, 1);`;
        await db.query(usersql);
      }
      return res;
    } catch(err) {
      throw new Error(err);
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

        // Load users
        const usersql = `SELECT user_id FROM user_role WHERE role_id="${ this.getID() } AND active <> 0;"`;
        const usersRes = await db.query(usersql);
        for(let i = 0; i < usersRes.length; i++) {
          this.addUser(usersRes[i].user_id);
        }
        return this;
      }
    } catch(err) {
      throw new Error(err);
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
      throw new Error(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE role SET type="${ this.getType() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);

      // Check if any users have to be deleted
      const usersql = `SELECT user_id FROM user_role WHERE role_id="${ this.getID() }" AND active <> 0;`;
      const usersRes = await db.query(usersql);
      const usersToRemove = [];
      for (let i = 0; i < usersRes.length; i++) {
        if (!this.users.includes(usersRes[i].user_id)) {
          usersToRemove.push(usersRes[i].user_id);
        }
      }

      if (usersToRemove.length > 0) {
        const remusersql = `UPDATE user_role SET active=0 WHERE user_id IN (${ usersToRemove.join() }) AND role_id=${ this.getID() };`;
        await db.query(remusersql);
      }

      return JSON.stringify(res);
    } catch(err) {
      throw new Error(err);
    }
  }

  async del() {
    this.setActive(false);
    await this.update();
  }
}

module.exports = Role;
