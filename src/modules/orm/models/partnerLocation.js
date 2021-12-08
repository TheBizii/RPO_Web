const model = require('../model');
const address = require('address');
const partner = require('partner');

const Model = model.Model;
const Address = address.Address;
const partner = partner.Partner;

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

  getAddress() {
    return this.address;
  }

  getPartner() {
    return this.partner;
  }

  getTitle() {
    return this.title;
  }
}

module.exports = PartnerLocation;
