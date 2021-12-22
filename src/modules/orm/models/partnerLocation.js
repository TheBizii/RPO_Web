const db = require('../../db');
const model = require('../model');
const Address = require('./address');
const Partner = require('./partner');

const Model = model.Model;

class PartnerLocation extends Model {
  constructor() {
    super();
  }

  setAddress(address) {
    if(address.constructor === Address) {
      this.address = address;
    } else {
      throw new Error(`Got ${address.constructor}, expected object of type Address.`);
    } 
  }

  setPartner(partner) {
    if(partner.constructor === Partner) {
      this.partner = partner;
    } else {
      throw new Error(`Got ${partner.constructor}, expected object of type Partner.`);
    }
  }

  setTitle(title) {
    this.title = title;
  }

  addGoods(goods) {
    if(this.goods === undefined) {
      this.goods = [];
    }

    if(this.goods.includes(goods)) return;
    this.goods.push(goods);
  }

  removeGoods(goods) {
    if(this.goods === undefined) return;

    this.goods = this.goods.filter(g => g !== goods);
  }

  getAddress() {
    return this.address;
  }

  getPartner() {
    return this.partner;
  }

  getTitle() {
    return this.title;
  }

  getGoods() {
    return this.goods;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO partner_location (address_id, partner_id, title, active) VALUES ("${ this.getAddress().getID() }", "${ this.getPartner().getID() }", "${ this.getTitle() }", 1);`;
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
      let sql = `SELECT * FROM partner_location WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let loc = res[0];
        let address = new Address();
        await address.read(loc.address_id);
        let partner = new Partner();
        await partner.read(loc.partner_id);
        this.setID(loc.ID);
        this.setTitle(loc.title);
        this.setAddress(address);
        this.setPartner(partner);
        this.setActive(loc.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM partner_location WHERE active <> 0`;
      let res = await db.query(sql);
      let locs = [];
      for(let i = 0; i < res.length; i++) {
        let loc = new PartnerLocation();
        await loc.read(res[i].ID);
        locs.push(loc);
      }
      return locs;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE partner_location SET address_id="${ this.getAddress().getID() }", partner_id="${ this.getPartner().getID() }", title="${ this.getTitle() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = PartnerLocation;
