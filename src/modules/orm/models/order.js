const db = require('../../db');
const model = require('../model');
const User = require('./user'):

const Model = model.Model;

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

  setValueWithDiscount(valueWithDiscount) {
    this.valueWithDiscount = valueWithDiscount;
  }
  
  addCoupon(coupon) {
    if (this.coupons === undefined) {
      this.coupons = [];
    }

    if (this.coupons.includes(coupon)) return;

    this.coupons.push(coupon);
  }

  removeCoupon(coupon) {
    if (this.coupons === undefined) return;

    this.coupons = this.coupons.filter(c => c !== coupon);
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

  getValueWithDiscount() {
    return this.valueWithDiscount;
  }

  getCoupons() {
    return this.coupons;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO order (date, deliverer_id, customer_id, total_value, total_discount_percentage, value_with_discount, active) VALUES ("${ this.getDate() }", "${ this.getDeliverer().getID() }", "${ this.getCustomer().getID() }", "${ this.getTotalValue() }", "${ this.getTotalDiscountPercentage() }", "${ this.getValueWithDiscount() }", 1);`;
      let res = await db.query(sql);
      this.setID(res.insertId);
      
      for(let i = 0; i < this.getCoupons().length; i++) {
        const couponsql = `INSERT INTO used_coupons (order_id, coupon_id, active) VALUES (${ this.getID() }, ${ this.getCoupons()[i] }, 1);`;
        await db.query(couponsql);
      }
      
      return res;
    } catch(err) {
      console.log(err);
    }
    return null;
  }

  async read(id) {
    try {
      let sql = `SELECT * FROM order WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let order = res[0];
        let deliverer = new User();
        let customer = new User();
        await deliverer.read(order.deliverer_id);
        await customer.read(order.customer_id);
        this.setID(order.ID);
        this.setDate(order.date);
        this.setDeliverer(deliverer);
        this.setCustomer(customer);
        this.setTotalValue(order.total_value);
        this.setTotalDiscountPercentage(order.total_discount_percentage);
        this.setValueWithDiscount(order.value_with_discount);
        this.setActive(order.active);

        // Load coupons
        const couponsql = `SELECT coupon_id FROM used_coupons WHERE order_id="${order.ID}" AND active <> 0;`
        const couponsRes = await db.query(couponsql)
        for (let i = 0; i < couponsRes.length; i++) {
          this.addCoupon(couponsRes[i].coupon_id)
        }
        
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM order WHERE active <> 0`;
      let res = await db.query(sql);
      let orders = [];
      for(let i = 0; i < res.length; i++) {
        let order = new Order();
        await order.read(res[i].ID);
        orders.push(order);
      }
      return orders;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE order SET date="${ this.getDate() }", deliverer_id="${ this.getDeliverer().getID() }", customer_id="${ this.getCustomer().getID() }", total_value="${ this.getTotalValue() }" total_discount_percentage="${ this.getTotalDiscountPercentage() }", value_with_discount="${ this.getValueWithDiscount() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);

      // Check if any coupons have to be deleted
      const couponsql = `SELECT coupon_id FROM used_coupons WHERE order_id="${this.getID()}" AND active <> 0;`
      const couponsRes = await db.query(couponsql)
      const couponsToRemove = []
      for (let i = 0; i < couponsRes.length; i++) {
        if (!this.coupon.includes(couponsRes[i].coupon_id)) {
          couponsToRemove.push(couponsRes[i].coupon_id)
        }
      }

      if (couponsToRemove.length > 0) {
        const remcouponsql = `UPDATE used_coupons SET active=0 WHERE coupon_id IN (${couponsToRemove.join()}) AND order_id=${this.getID()};`
        await db.query(remcouponsql)
      }

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

module.exports = Order;
