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

  addGoods(goods) {
    if(this.goods === undefined) {
      this.goods = [];
    }

    if(this.goods.includes(goods)) return;
    this.goods.push(goods);
  }

  removeGoods(goods) {
    if(this.goods === undefined) return;

    this.goods = this.goods.filter(g => g !== goods);
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

  getGoods() {
    return this.goods;
  }

  async create() {
    try {
      this.setActive(true);
      let sql = `INSERT INTO category (title, parent_category_id, image_url, active) VALUES ("${ this.getTitle() }", "${ this.getParentCategory().getID() }", "${ this.getImageUrl() }", 1);`;
      let res = await db.query(sql);
      this.setID(res.insertId);

      for(let i = 0; i < this.getGoods().length; i++) {
        const goodsql = `INSERT INTO goods_category (category_id, goods_id, active) VALUES (${ this.getID() }, ${ this.getGoods()[i] }, 1);`;
        await db.query(goodsql);
      }
      return res;
    } catch(err) {
      throw new Error(err);
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

        // Load goods
        const goodsql = `SELECT goods_id FROM goods_category WHERE category_id="${category.ID}" AND active <> 0;`
        const goodsRes = await db.query(goodsql)
        for (let i = 0; i < goodsRes.length; i++) {
          this.addGoods(goodsRes[i].goods_id)
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
      throw new Error(err);
    }

    return null;
  }

  async update() {
    try {
      let sql = `UPDATE category SET title="${ this.getTitle() }", parent_category_id="${ this.getParentCategory().getID() }", image_url="${ this.getImageUrl() }", active="${ this.getActive() }" WHERE ID=${ this.getID() };`;
      let res = await db.query(sql);

      // Check if any goods have to be deleted
      const goodsql = `SELECT goods_id FROM goods_category WHERE category_id="${this.getID()}" AND active <> 0;`
      const goodsRes = await db.query(goodsql)
      const goodsToRemove = []
      for (let i = 0; i < goodsRes.length; i++) {
        if (!this.goods.includes(goodsRes[i].goods_id)) {
          goodsToRemove.push(goodsRes[i].goods_id)
        }
      }

      if (goodsToRemove.length > 0) {
        const remgoodsql = `UPDATE goods_category SET active=0 WHERE goods_id IN (${goodsToRemove.join()}) AND category_id=${this.getID()};`
        await db.query(remgoodsql)
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

module.exports = Category;
