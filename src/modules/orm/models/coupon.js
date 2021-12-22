const db = require('../../db');
const model = require('../model');
const Category = require('./category');
const Goods = require('./goods');

const Model = model.Model;

class Coupon extends Model {
  constructor() {
    super();
  }

  setTitle(title) {
    this.title = title;
  }

  setAffectedCategory(affectedCategory) {
    if(affectedCategory.constructor === Category) {
      this.affectedCategory = affectedCategory;
    } else {
      throw new Error(`Got ${affectedCategory.constructor}, expected object of type Category.`);
    }
  }

  setAffectedArticle(affectedArticle) {
    if(affectedArticle.constructor === Goods) {
      this.affectedArticle = affectedArticle;
    } else {
      throw new Error(`Got ${affectedArticle.constructor}, expected object of type Goods.`);
    }
  }

  setDescription(description) {
    this.description = description;
  }

  setDiscount(discount) {
    this.discount = discount;
  }

  setDateAdded(dateAdded) {
    this.dateAdded = dateAdded;
  }

  setExpirationDate(expirationDate) {
    this.expirationDate = expirationDate;
  }

  setAffectsShipping(affectsShipping) {
    this.affectsShipping = affectsShipping;
  }

  setCode(code) {
    this.code = code;
  }

  addOrder(order) {
    if (this.orders === undefined) {
      this.orders = [];
    }

    if (this.orders.includes(order)) return;

    this.orders.push(order);
  }

  removeOrder(order) {
    if (this.orders === undefined) return;

    this.orders = this.orders.filter(o => o !== order);
  }

  getTitle() {
    return this.title;
  }

  getAffectedCategory() {
    return this.affectedCategory;
  }

  getAffectedArticle() {
    return this.affectedArticle;
  }

  getDescription() {
    return this.description;
  }

  getDiscount() {
    return this.discount;
  }

  getDateAdded() {
    return this.dateAdded;
  }

  getExpirationDate() {
    return this.expirationDate;
  }

  getAffectsShipping() {
    return this.affectsShipping;
  }

  getCode() {
    return this.code;
  }

  getOrders() {
    return this.orders;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO coupon (title, affected_category_id, affected_article_id, description, discount, date_added, date_expiration, affects_shipping, code, active) VALUES ("${ this.getTitle() }", "${ this.getAffectedCategory().getID() }", "${ this.getAffectedArticle().getID() }", "${ this.getDescription() }", "${ this.getDiscount() }", "${ this.getDateAdded() }", "${ this.getExpirationDate() }", "${ this.getAffectsShipping() }", "${ this.getCode() }", 1);`;
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
      let sql = `SELECT * FROM coupon WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let coupon = res[0];
        let affectedCategory = new Category();
        await affectedCategory.read(coupon.affected_category_id);
        let affectedArticle = new Goods();
        await affectedArticle.read(coupon.affected_article_id);
        this.setID(coupon.ID);
        this.setTitle(coupon.title);
        this.setAffectedCategory(affectedCategory);
        this.setAffectedArticle(affectedArticle);
        this.setDescription(coupon.description);
        this.setDiscount(coupon.discount);
        this.setDateAdded(coupon.date_added);
        this.setExpirationDate(coupon.date_expiration);
        this.setAffectsShipping(coupon.affects_shipping);
        this.setCode(coupon.code);
        this.setActive(coupon.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM coupon WHERE active <> 0`;
      let res = await db.query(sql);
      let coupons = [];
      for(let i = 0; i < res.length; i++) {
        let coupon = new Coupon();
        await coupon.read(res[i].ID);
        coupons.push(coupon);
      }
      return coupons;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE coupon SET title="${ this.getTitle() }", affected_category_id="${ this.getAffectedCategory().getID() }", affected_article_id="${ this.getAffectedArticle().getID() }", description="${ this.getDescription() }" discount="${ this.getDiscount() }" date_added="${ this.getDateAdded() }" date_expiration="${ this.getExpirationDate() }" affects_shipping="${ this.getAffectsShipping() }" code="${ this.getCode() }" active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Coupon;
