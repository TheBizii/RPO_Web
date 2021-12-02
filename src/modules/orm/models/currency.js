const model = require('../model');

const Model = model.Model;

class Currency extends Model {
  constructor() {
    super();
  }

  setName(name) {
    this.name = name;
  }

  setSymbol(symbol) {
    this.symbol = symbol;
  }

  setAbbreviation(abbreviation) {
    this.abbreviation = abbreviation;
  }

  getName() {
    return this.name;
  }

  getSymbol() {
    return this.symbol;
  }

  getAbbreviation() {
    return this.abbreviation;
  }
}

module.exports = {
  Currency: Currency
}
