const model = require('../model');
const country = require('country');

const Model = model.Model;
const Country = country.Country;

class Post extends Model {
  constructor() {
    super();
  }

  setCityName(cityName) {
    this.cityName = cityName;
  }

  setCountry(country) {
    if(country.constructor === Country) {
      this.country = country;
    } else {
      throw new Error(`Got ${country.constructor}, expected object of type Country.`);
    }

  }

  getCityName() {
    return this.cityName;
  }

  getCountry() {
    return this.country;
  }
}

module.exports = Post;
