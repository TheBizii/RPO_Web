const model = require('../model');
const address = require('address');

const Model = model.Model;
const Address = address.Address;

class Partner extends Model {
  constructor() {
    super();
  }

  setCompanyName(companyName) {
    this.companyName = companyName;
  }

  setOfficeAddress(officeAddress) {
    if(officeAddress.constructor === Address) {
      this.officeAddress = officeAddress;
    } else {
      throw new Error(`Got ${officeAddress.constructor}, expected object of type Address.`);
    }
  }

  setIBAN(iban) {
    this.iban = iban;
  }

  getCompanyName() {
    return this.companyName;
  }

  getOfficeAddress() {
    return this.officeAddress;
  }

  getIBAN() {
    return this.IBAN;
  }
}

module.exports = Partner;
