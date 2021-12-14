const db = require('../../db');
const model = require('../model');
const Country = require('./country');

const Model = model.Model;

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

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO post (city_name, country_id, active) VALUES ("${ this.getCityName() }", "${ this.getCountry().getID() }", 1);`;
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
      let sql = `SELECT * FROM post WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let post = res[0];
        let country = new Country();
        await country.read(post.country_id);
        this.setID(post.ID);
        this.setCityName(post.city_name);
        this.setCountry(country);
        this.setActive(post.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM post WHERE active <> 0`;
      let res = await db.query(sql);
      let posts = [];
      for(let i = 0; i < res.length; i++) {
        let post = new Post();
        await post.read(res[i].ID);
        posts.push(post);
      }
      return posts;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE post SET city_name="${ this.getCityName() }", country_id="${ this.getCountry().getID() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Post;
