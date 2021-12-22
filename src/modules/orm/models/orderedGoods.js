const db = require('../../db');
const model = require('../model');
const Order = require('./order');
const Goods = require('./goods');

const Model = model.Model;

class OrderedGoods extends Model {
  constructor() {
    super();
  }

  setUnitPrice(unitPrice) {
    this.unitPrice = unitPrice;
  }

  setTotalValue(totalValue) {
    this.totalValue = totalValue;
  }

  setAmount(amount) {
    this.amount = amount;
  }

  setOrder(order) {
    if(order.constructor === Order) {
      this.order = order;
    } else {
      throw new Error(`Got ${order.constructor}, expected object of type Order.`);
    }
  }

  setGoods(goods) {
    if(goods.constructor === Goods) {
      this.goods = goods;
    } else {
      throw new Error(`Got ${goods.constructor}, expected object of type Goods.`);
    }
  }

  getUnitPrice() {
    return this.unitPrice;
  }

  getTotalValue() {
    return this.totalValue;
  }

  getAmount() {
    return this.amount;
  }

  getOrder() {
    return this.order;
  }

  getGoods() {
    return this.goods;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO ordered_goods (order_id, goods_id, unit_price, total_value, amount, active) VALUES ("${ this.getOrder().getID() }", "${ this.getGoods().getID() }", "${ this.getUnitPrice() }", "${ this.getTotalValue() }", "${ this.getAmount() }", 1);`;
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
      let sql = `SELECT * FROM ordered_goods WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let orderedGoods = res[0];
        let order = new Order();
        await order.read(orderedGoods.order_id);
        let goods = new Goods();
        await goods.read(orderedGoods.goods_id);
        this.setID(orderedGoods.ID);
        this.setUnitPrice(orderedGoods.unit_price);
        this.setTotalValue(orderedGoods.total_value);
        this.setAmount(orderedGoods.amount);
        this.setActive(orderedGoods.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM ordered_goods WHERE active <> 0`;
      let res = await db.query(sql);
      let orderedGoodsArr = [];
      for(let i = 0; i < res.length; i++) {
        let orderedGoods = new OrderedGoods();
        await orderedGoods.read(res[i].ID);
        orderedGoodsArr.push(orderedGoods);
      }
      return orderedGoodsArr;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE ordered_goods SET order_id="${ this.getOrder().getID() }", goods_id="${ this.getGoods().getID() }", unit_price="${ this.getUnitPrice() }", total_value="${ this.getTotalValue() }", amount="${ this.getAmount() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = OrderedGoods;
