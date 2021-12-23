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
    return this.partnerLocations;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO goods (name, currency_id, price, description, image_url, active) VALUES ("${ this.getName() }", "${ this.getCurrency().getID() }", "${ this.getPrice() }", "${ this.getDescription() }", "${ this.getImageUrl() }", 1);`;
      let res = await db.query(sql);
      this.setID(res.insertId);

      for(let i = 0; i < this.getCategories().length; i++) {
        const categoriesql = `INSERT INTO goods_category (category_id, goods_id, active) VALUES (${ this.getCategories()[i] }, ${ this.getID() }, 1);`;
        await db.query(categoriesql);
      }
      
      for(let i = 0; i < this.getPartnerLocations().length; i++) {
        const parlocsql = `INSERT INTO partner_location_goods (partner_location_id, goods_id, active) VALUES (${ this.getPartnerLocations()[i] }, ${ this.getID() }, 1);`;
        await db.query(parlocsql);
      }
      
      return res;
    } catch(err) {
      throw new Error(err);
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

        // Load categories
        const categoriesql = `SELECT category_id FROM goods_category WHERE goods_id="${goods.ID}" AND active <> 0;`
        const categoriesRes = await db.query(categoriesql)
        for (let i = 0; i < categoriesRes.length; i++) {
          this.addCategory(categoriesRes[i].category_id)
        }

        // Load partner locations
        const parlocsql = `SELECT partner_location_id FROM partner_location_goods WHERE goods_id="${goods.ID}" AND active <> 0;`
        const parlocsRes = await db.query(parlocsql)
        for (let i = 0; i < parlocsRes.length; i++) {
          this.addPartnerLocation(parlocsRes[i].partner_location_id)
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
      throw new Error(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE goods SET name="${ this.getName() }", currency_id="${ this.getCurrency().getID() }", price="${ this.getPrice() }", description="${ this.getDescription() }" image_url="${ this.getImageUrl() }" active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);

      // Check if any categories have to be deleted
      const categoriesql = `SELECT category_id FROM goods_category WHERE goods_id="${this.getID()}" AND active <> 0;`
      const categoriesRes = await db.query(categoriesql)
      const categoriesToRemove = []
      for (let i = 0; i < categoriesRes.length; i++) {
        if (!this.categories.includes(categoriesRes[i].category_id)) {
          categoriesToRemove.push(categoriesRes[i].category_id)
        }
      }

      if (categoriesToRemove.length > 0) {
        const remcategoriesql = `UPDATE goods_category SET active=0 WHERE category_id IN (${categoriesToRemove.join()}) AND goods_id=${this.getID()};`
        await db.query(remcategoriesql)
      }

      // Check if any partner locations have to be deleted
      const parlocsql = `SELECT partner_location_id FROM partner_location_goods WHERE goods_id="${this.getID()}" AND active <> 0;`
      const parlocsRes = await db.query(parlocsql)
      const parlocsToRemove = []
      for (let i = 0; i < parlocsRes.length; i++) {
        if (!this.partnerLocations.includes(parlocsRes[i].partner_location_id)) {
          parlocsToRemove.push(parlocsRes[i].partner_location_id)
        }
      }

      if (parlocsToRemove.length > 0) {
        const remparlocsql = `UPDATE partner_location_goods SET active=0 WHERE partner_location_id IN (${parlocsToRemove.join()}) AND goods_id=${this.getID()};`
        await db.query(remparlocsql)
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

module.exports = Goods;
