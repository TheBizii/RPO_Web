const db = require('../../db');
const model = require('../model');

const Model = model.Model;

class Country extends Model {
  constructor() {
    super();
  }

  setName(name) {
    this.name = name;
  }

  setCallingCode(callingCode) {
    this.callingCode = callingCode;
  }

  setAlpha3Code(alpha3Code) {
    this.alpha3Code = alpha3Code;
  }

  getName() {
    return this.name;
  }

  getCallingCode() {
    return this.callingCode;
  }

  getAlpha3Code() {
    return this.alpha3Code;
  }

  async create() {
    try {
      this.setActive(true); 
      let sql = `INSERT INTO country (name, calling_code, alpha3_code, active) VALUES ("${ this.getName() }", "${ this.getCallingCode() }", "${ this.getAlpha3Code() }", 1);`;
      let res = await db.query(sql);
      this.setID(res.insertId);
      return res;
    } catch(err) {
      throw new Error(err);
    }
    return null;
  }

  async read(id) {
    try {
      let sql = `SELECT * FROM country WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let country = res[0];
        this.ID = country.ID;
        this.setName(country.name);
        this.setCallingCode(country.calling_code);
        this.setAlpha3Code(country.alpha3_code);
        this.setActive(country.active);
        return this;
      }
    } catch(err) {
      throw new Error(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM country WHERE active <> 0`;
      let res = await db.query(sql); 
      let countries = [];
      for(let i = 0; i < res.length; i++) {
        let country = new Country();
        await country.read(res[i].ID);
        countries.push(country);
      }
      return countries;
    } catch(err) {
      throw new Error(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE country SET name="${ this.getName() }", calling_code="${ this.getCallingCode() }", alpha3_code="${ this.getAlpha3Code() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);
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

module.exports = Country;
