const model = require('../model');

const Model = model.Model;

class User extends Model {
  constructor() {
    super();
  }

  setFirstName(firstName) {
    this.firstName = firstName;
  }

  setMiddleName(middleName) {
    this.middleName = middleName;
  }

  setLastName(lastName) {
    this.lastName = lastName;
  }

  setPhone(phone) {
    this.phone = phone;
  }

  // TODO: addAddress, removeAddress

  getFirstName() {
    return this.firstName;
  }

  getMiddleName() {
    return this.middleName;
  }

  getLastName() {
    return this.lastName;
  }

  getPhone() {
    return this.phone;
  }

  // NOTE: This is table customer_addresses
  getAddresses() {
    return this.addresses;
  }
}

module.exports = User;
