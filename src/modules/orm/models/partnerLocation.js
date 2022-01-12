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

      for(let i = 0; i < this.getGoods().length; i++) {
        const goodsql = `INSERT INTO partner_location_goods (partner_location_id, goods_id, active) VALUES (${ this.getID() }, ${ this.getGoods()[i] }, 1);`;
        await db.query(goodsql);
      }
      return res;
    } catch(err) {
      throw new Error(err);
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
        
        // Load goods
        const goodsql = `SELECT goods_id FROM partner_location_goods WHERE partner_location_id="${loc.ID}" AND active <> 0;`
        const goodsRes = await db.query(goodsql)
        for (let i = 0; i < goodsRes.length; i++) {
          this.addGoods(goodsRes[i].goods_id)
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
      throw new Error(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE partner_location SET address_id="${ this.getAddress().getID() }", partner_id="${ this.getPartner().getID() }", title="${ this.getTitle() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);

      // Check if any goods have to be deleted
      const goodsql = `SELECT goods_id FROM partner_location_goods WHERE partner_location_id="${this.getID()}" AND active <> 0;`
      const goodsRes = await db.query(goodsql)
      const goodsToRemove = []
      for (let i = 0; i < goodsRes.length; i++) {
        if (!this.goods.includes(goodsRes[i].goods_id)) {
          goodsToRemove.push(goodsRes[i].goods_id)
        }
      }

      if (goodsToRemove.length > 0) {
        const remgoodsql = `UPDATE partner_location_goods SET active=0 WHERE goods_id IN (${goodsToRemove.join()}) AND partner_location_id=${this.getID()};`
        await db.query(remgoodsql)
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

module.exports = PartnerLocation;
