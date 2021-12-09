const db = require('../../db');
const model = require('../model');

const Model = model.Model;

class State extends Model {
  constructor() {
    super();
  }

  setTitle(title) {
    this.title = title;
  }

  getTitle() {
    return this.title;
  }

  async create() {
    try {
      this.setActive(true); 
      let sql = `INSERT INTO state (title, active) VALUES ("${ this.getTitle() }", 1);`;
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
      let sql = `SELECT * FROM state WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let state = res[0];
        this.setID(state.ID);
        this.setTitle(state.title);
        this.setActive(state.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM state WHERE active <> 0`;
      let res = await db.query(sql); 
      let states = [];
      for(let i = 0; i < res.length; i++) {
        let state = new State();
        await state.read(res[i].ID);
        states.push(state);
      }
      return states;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE state SET title="${ this.getTitle() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = State;
