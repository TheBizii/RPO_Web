const model = require('../model');
const goods = require('goods');
const partnerLocation = require('partnerLocation');

const Model = model.Model;
const Goods = goods.Goods;
const partnerLocation = partnerLocation.PartnerLocation;

class PartnerLocationGoods extends Model {
  constructor() {
    super();
  }

  setGoods(goods) {
    if(goods.constructor === Goods) {
      this.goods = goods;
    } else {
      throw new Error(`Got ${goods.constructor}, expected object of type Goods.`);
    } 
  }

  setPartnerLocation(partnerLocation) {
    if(partnerLocation.constructor === PartnerLocation) {
      this.partnerLocation = partnerLocation;
    } else {
      throw new Error(`Got ${partnerLocation.constructor}, expected object of type PartnerLocation.`);
    }
  }

  getGoods() {
    return this.goods;
  }

  getPartnerLocation() {
    return this.partnerLocation;
  }
}

module.exports = PartnerLocationGoods;
