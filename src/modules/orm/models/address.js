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

  setCoordinates(coordinates) {
    this.coordinates = coordinates;
  }

  setPost(post) {
    if(post.constructor === Post) {
      this.post = post;
    } else {
      throw new Error(`Got ${post.constructor}, expected object of type Post.`);
    }
  }

  addUser(user) {
    if(this.users === undefined) {
      this.users = [];
    }

    if(this.users.includes(user)) return;
    this.users.push(user);
  }

  removeUser(user) {
    if(this.users === undefined) return;

    this.users = this.users.filter(usr => usr !== user);
  }

  getAddress() {
    return this.address;
  }

  getCoordinates() {
    return this.coordinates;
  }

  getPost() {
    return this.post;
  }

  getUsers() {
    return this.users;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO address (address, coordinates, post_id, active) VALUES ("${ this.getAddress() }", POINT(${ this.getCoordinates().x }, ${ this.getCoordinates().y }), "${ this.getPost().getID() }", 1);`;
      let res = await db.query(sql);
      this.setID(res.insertId);
      
      for(let i = 0; i < this.getUsers().length; i++) {
        const addressql = `INSERT INTO customer_address (user_id, address_id, active) VALUES (${ this.getUsers()[i] }, ${ this.getID() }, 1);`;
        await db.query(addressql);
      }
      return res;
    } catch(err) {
      throw new Error(err);
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
        this.setCoordinates(address.coordinates);
        this.setPost(post);
        this.setActive(address.active);

        // Load users
        const usersql = `SELECT user_id FROM customer_address WHERE address_id="${id}" AND active <> 0;`
        const usersRes = await db.query(usersql)
        for (let i = 0; i < usersRes.length; i++) {
          this.addUser(usersRes[i].user_id)
        }

        return this;
      }
    } catch(err) {
      throw new Error(err);
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
      throw new Error(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE address SET address="${ this.getAddress() }", coordinates=POINT(${ this.getCoordinates().x }, ${ this.getCoordinates().y }), post_id="${ this.getPost().getID() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);

      // Check if any users have to be deleted
      const usersql = `SELECT user_id FROM customer_address WHERE address_id="${this.getID()}" AND active <> 0;`
      const usersRes = await db.query(usersql)
      const usersToRemove = []
      for (let i = 0; i < usersRes.length; i++) {
        if (!this.users.includes(usersRes[i].user_id)) {
          usersToRemove.push(usersRes[i].user_id)
        }
      }

      if (usersToRemove.length > 0) {
        const remusersql = `UPDATE customer_address SET active=0 WHERE user_id IN (${usersToRemove.join()}) AND address_id=${this.getID()};`
        await db.query(remusersql)
      }
      return JSON.stringify(res);
    } catch(err) {
      throw new Error(err);
    }
  }

  async del() {
    this.setActive(false);
    await this.update();
  }
}

module.exports = Address;
