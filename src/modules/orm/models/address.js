const db = require('../../db');
const model = require('../model');
const Post = require('./post');

const Model = model.Model;

class Address extends Model {
  constructor() {
    super();
  }

  setAddress(address) {
    this.address = address;
  }

  setPost(post) {
    if(post.constructor === Post) {
      this.post = post;
    } else {
      throw new Error(`Got ${post.constructor}, expected object of type Post.`);
    }
  }

  getAddress() {
    return this.address;
  }

  getPost() {
    return this.post;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO address (address, post_id, active) VALUES ("${ this.getAddress() }", "${ this.getPost().getID() }", 1);`;
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
      let sql = `SELECT * FROM address WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let address = res[0];
        let post = new Post();
        await post.read(address.post_id);
        this.setID(address.ID);
        this.setAddress(address.address);
        this.setPost(post);
        this.setActive(address.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM address WHERE active <> 0`;
      let res = await db.query(sql);
      let addresses = [];
      for(let i = 0; i < res.length; i++) {
        let address = new Address();
        await address.read(res[i].ID);
        addresses.push(address);
      }
      return addresses;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE address SET address="${ this.getAddress() }", post_id="${ this.getPost().getID() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Address;
