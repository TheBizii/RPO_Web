const db = require('../../db');
const model = require('../model');
const Address = require('./address');

const Model = model.Model;

class Partner extends Model {
  constructor() {
    super();
  }

  setCompanyName(companyName) {
    this.companyName = companyName;
  }

  setOfficeAddress(officeAddress) {
    if(officeAddress.constructor === Address) {
      this.officeAddress = officeAddress;
    } else {
      throw new Error(`Got ${officeAddress.constructor}, expected object of type Address.`);
    }
  }

  setIBAN(iban) {
    this.iban = iban;
  }

  getCompanyName() {
    return this.companyName;
  }

  getOfficeAddress() {
    return this.officeAddress;
  }

  getIBAN() {
    return this.IBAN;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO partner (company_name, office_address_id, iban, active) VALUES ("${ this.getCompanyName() }", "${ this.getOfficeAddress().getID() }", "${ this.getIBAN() }", 1);`;
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
      let sql = `SELECT * FROM partner WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let partner = res[0];
        let address = new Address();
        await address.read(partner.office_address_id);
        this.setID(partner.ID);
        this.setCompanyName(partner.company_name);
        this.setOfficeAddress(address);
        this.setIBAN(partner.iban);
        this.setActive(partner.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM partner WHERE active <> 0`;
      let res = await db.query(sql);
      let partners = [];
      for(let i = 0; i < res.length; i++) {
        let partner = new Partner();
        await partner.read(res[i].ID);
        partners.push(partner);
      }
      return partners;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE partner SET company_name="${ this.getCompanyName() }", office_address_id="${ this.getOfficeAddress().getID() }", iban="${ this.getIBAN() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Partner;
