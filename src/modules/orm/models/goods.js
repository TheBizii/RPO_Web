const db = require('../../db');
const model = require('../model');
const Currency = require('./currency');

const Model = model.Model;

class Goods extends Model {
  constructor() {
    super();
  }

  setName(name) {
    this.name = name;
  }

  setCurrency(currency) {
    if(currency.constructor === Currency) {
      this.currency = currency;
    } else {
      throw new Error(`Got ${currency.constructor}, expected object of type Currency.`);
    }
  }

  setPrice(price) {
    this.price = price;
  }

  setDescription(description) {
    this.description = description;
  }

  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
  }

  addCategory(category) {
    if(this.categories === undefined) {
      this.categories = [];
    }

    if(this.categories.includes(category)) return;
    this.categories.push(category);
  }

  removeCategory(category) {
    if(this.categories === undefined) return;

    this.categories = this.categories.filter(cat => cat !== category);
  }

  addPartnerLocation(partnerLocation) {
    if(this.partnerLocations === undefined) {
      this.partnerLocations = [];
    }

    if(this.partnerLocations.includes(partnerLocation)) return;
    this.partnerLocations.push(partnerLocation);
  }
  
  removePartnerLocation(partnerLocation) {
    if(this.partnerLocations === undefined) return;

    this.partnerLocations = this.partnerLocations.filter(loc => loc !== partnerLocation);
  }

  getName() {
    return this.name;
  }

  getCurrency() {
    return this.currency;
  }

  getPrice() {
    return this.price;
  }

  getDescription() {
    return this.description;
  }

  getImageUrl() {
    return this.imageUrl;
  }

  getCategories() {
    return this.categories;
  }

  getPartnerLocations() {
    return this.partnerLocations();
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO goods (name, currency_id, price, description, image_url, active) VALUES ("${ this.getName() }", "${ this.getCurrency().getID() }", "${ this.getPrice() }", "${ this.getDescription() }", "${ this.getImageUrl() }", 1);`;
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
      let sql = `SELECT * FROM goods WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let goods = res[0];
        let currency = new Currency();
        await currency.read(goods.currency_id);
        this.setID(goods.ID);
        this.setName(goods.name);
        this.setCurrency(currency);
        this.setPrice(goods.price);
        this.setDescription(goods.description);
        this.setImageUrl(goods.image_url);
        this.setActive(goods.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM goods WHERE active <> 0`;
      let res = await db.query(sql);
      let allGoods = [];
      for(let i = 0; i < res.length; i++) {
        let goods = new Goods();
        await goods.read(res[i].ID);
        allGoods.push(goods);
      }
      return allGoods;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE goods SET name="${ this.getName() }", currency_id="${ this.getCurrency().getID() }", price="${ this.getPrice() }", description="${ this.getDescription() }" image_url="${ this.getImageUrl() }" active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Goods;
