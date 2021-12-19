const db = require('../../dn');
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
}

module.exports = PartnerLocation;
