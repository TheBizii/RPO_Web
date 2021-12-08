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
      let sql = `INSERT INTO country (name, calling_code, alpha3_code, active) VALUES (${ this.getName() }, ${ this.getCallingCode() }, ${ this.getAlpha3Code() }, 1);`;
      const res = [];
      await db.connectToDB();
      
    }
  }

  read() {

  }

  update() {

  }

  del() {

  }
}

module.exports = Country;
