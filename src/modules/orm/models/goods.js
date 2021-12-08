const model = require('../model');
const currency = require('currency');

const Model = model.Model;
const Currency = currency.Currency;

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

  // TODO: addCategory, removeCategory

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
}

module.exports = Goods;
