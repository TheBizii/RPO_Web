const db = require('../../db');
const model = require('../model');

const Model = model.Model;

class Currency extends Model {
  constructor() {
    super();
  }

  setName(name) {
    this.name = name;
  }

  setSymbol(symbol) {
    this.symbol = symbol;
  }

  setAbbreviation(abbreviation) {
    this.abbreviation = abbreviation;
  }

  getName() {
    return this.name;
  }

  getSymbol() {
    return this.symbol;
  }

  getAbbreviation() {
    return this.abbreviation;
  }
 
  async create() {
    try {
      this.setActive(true); 
      let sql = `INSERT INTO currency (name, symbol, abbreviation, active) VALUES ("${ this.getName() }", "${ this.getSymbol() }", "${ this.getAbbreviation() }", 1);`;
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
      let sql = `SELECT * FROM currency WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let currency = res[0];
        this.setID(currency.ID);
        this.setName(currency.name);
        this.setSymbol(currency.symbol);
        this.setAbbreviation(currency.abbreviation);
        this.setActive(currency.active);
        return this;
      }
    } catch(err) {
      throw new Error(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM currency WHERE active <> 0`;
      let res = await db.query(sql); 
      let currencies = [];
      for(let i = 0; i < res.length; i++) {
        let currency = new Currency();
        await currency.read(res[i].ID);
        currencies.push(currency);
      }
      return currencies;
    } catch(err) {
      throw new Error(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE currency SET name="${ this.getName() }", symbol="${ this.getSymbol() }", abbreviation="${ this.getAbbreviation() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Currency;
