const model = require('../model');
const user = require('user'):

const Model = model.Model;
const User = user.User;

class Order extends Model {
  constructor() {
    super();
  }

  setDate(date) {
    this.date = date;
  }

  setDeliverer(deliverer) {
    if(deliverer.constructor === User) {
      this.deliverer = deliverer;
    } else {
      throw new Error(`Got ${deliverer.constructor}, expected object of type User.`);
    }
  }
  
  setCustomer(customer) {
    if(customer.constructor === User) {
      this.customer = customer;
    } else {
      throw new Error(`Got ${customer.constructor}, expected object of type User.`);
    }
  }

  setTotalValue(totalValue) {
    this.totalValue = totalValue;
  }

  setTotalDiscountPercentage(totalDiscountPercentage) {
    this.totalDiscountPercentage = totalDiscountPercentage;
  }
  
  getDate() {
    return this.date;
  }

  getDeliverer() {
    return this.deliverer;
  }

  getCustomer() {
    return this.customer;
  }

  getTotalValue() {
    return this.totalValue;
  }

  getTotalDiscountPercentage() {
    return this.totalDiscountPercentage;
  }
}

module.exports = Order;
