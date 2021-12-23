const db = require('../../db');
const model = require('../model');
const Order = require('./order');
const State = require('./state');

const Model = model.Model;

class OrderState extends Model {
  constructor() {
    super();
  }

  setDate(date) {
    this.date = date;
  }

  setOrder(order) {
    if(order.constructor === Order) {
      this.order = order;
    } else {
      throw new Error(`Got ${order.constructor}, expected object of type Order.`);
    }
  }

  setState(state) {
    if(state.constructor === State) {
      this.state = state;
    } else {
      throw new Error(`Got ${state.constructor}, expected object of type State.`);
    }
  }

  getDate() {
    return this.date;
  }

  getOrder() {
    return this.order;
  }

  getState() {
    return this.state;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO order_state (order_id, state_id, date, active) VALUES ("${ this.getOrder().getID() }", "${ this.getState().getID() }", "${ this.getDate() }", 1);`;
      let res = await db.query(sql);
      this.setID(res.insertId);
      return res;
    } catch(err) {
      throw new Error(err);
    }
    return null;
  }

  async read(id) {
    try {
      let sql = `SELECT * FROM order_state WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let orderState = res[0];
        let order = new Order();
        await order.read(orderState.order_id);
        let state = new State();
        await state.read(orderState.state_id);
        this.setID(orderState.ID);
        this.setDate(orderState.date);
        this.setOrder(order);
        this.setState(state);
        this.setActive(orderState.active);
        return this;
      }
    } catch(err) {
      throw new Error(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM order_state WHERE active <> 0`;
      let res = await db.query(sql);
      let orderStates = [];
      for(let i = 0; i < res.length; i++) {
        let orderState = new OrderState();
        await orderState.read(res[i].ID);
        orderStates.push(orderState);
      }
      return orderStates;
    } catch(err) {
      throw new Error(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE order_state SET order_id="${ this.getOrder().getID() }", state_id="${ this.getState().getID() }", date="${ this.getDate() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);
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

module.exports = OrderState;
