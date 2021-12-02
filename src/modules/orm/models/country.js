const model = require('../model');

const Model = model.Model;

class Country extends Model {
  constructor() {
    super();
  }

  setName(name) {
    this.name = name;
  }

  setCallingCode(callingCode) {
    this.callingCode = callingCode;
  }

  setAlpha3Code(alpha3Code) {
    this.alpha3Code = alpha3Code;
  }

  getName() {
    return this.name;
  }

  getCallingCode() {
    return this.callingCode;
  }

  getAlpha3Code() {
    return this.alpha3Code;
  }
}

module.exports = {
  Country: Country
}
