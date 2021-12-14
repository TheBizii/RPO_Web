const db = require('../../db');
const model = require('../model');

const Model = model.Model;

class Category extends Model {
  constructor() {
    super();
  }

  setTitle(title) {
    this.title = title;
  }

  setParentCategory(parentCategory) {
    if(parentCategory.constructor === this.constructor) {
      this.parentCategory = parentCategory;
    } else {
      throw new Error(`Got ${parentCategory.constructor}, expected object of type ${this.constructor}.`);
    }
  }

  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
  }

  getTitle() {
    return this.title;
  }

  getParentCategory() {
    return this.parentCategory;
  }

  getImageUrl() {
    return this.imageUrl;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO category (title, parent_category_id, image_url, active) VALUES ("${ this.getTitle() }", "${ this.getParentCategory().getID() }", "${ this.getImageUrl() }", 1);`;
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
      let sql = `SELECT * FROM category WHERE ID = ${ id } AND active <> 0;`;
      let res = await db.query(sql);
      if(res.length > 0) {
        let category = res[0];
        let parentCategory = new Category();
        await parentCategory.read(category.parent_category_id);
        this.setID(category.ID);
        this.setTitle(category.title);
        this.setParentCategory(parentCategory);
        this.setImageUrl(category.image_url);
        this.setActive(category.active);
        return this;
      }
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  static async readAll() {
    try {
      let sql = `SELECT ID FROM category WHERE active <> 0`;
      let res = await db.query(sql);
      let categories = [];
      for(let i = 0; i < res.length; i++) {
        let category = new Category();
        await category.read(res[i].ID);
        categories.push(category);
      }
      return categories;
    } catch(err) {
      console.log(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE category SET title="${ this.getTitle() }", parent_category_id="${ this.getParentCategory().getID() }", image_url="${ this.getImageUrl() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
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

module.exports = Category;
