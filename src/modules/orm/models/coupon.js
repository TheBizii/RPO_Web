const model = require('../model');
const category = require('category');
const goods = require('goods');

const Model = model.Model;
const Category = category.Category;
const Goods = category.Goods;

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
}

module.exports = Coupon;
