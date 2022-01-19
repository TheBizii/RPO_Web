const db = require('../../db')
const model = require('../model')
const Category = require('./category')
const Goods = require('./goods')

const Model = model.Model

class Coupon extends Model {
  constructor () {
    super()
  }

  setTitle (title) {
    this.title = title
  }

  setAffectedCategory (affectedCategory) {
    if (affectedCategory.constructor === Category) {
      this.affectedCategory = affectedCategory
    } else {
      throw new Error(`Got ${affectedCategory.constructor}, expected object of type Category.`)
    }
  }

  setAffectedArticle (affectedArticle) {
    if (affectedArticle.constructor === Goods) {
      this.affectedArticle = affectedArticle
    } else {
      throw new Error(`Got ${affectedArticle.constructor}, expected object of type Goods.`)
    }
  }

  setDescription (description) {
    this.description = description
  }

  setDiscount (discount) {
    this.discount = discount
  }

  setDateAdded (dateAdded) {
    this.dateAdded = dateAdded
  }

  setExpirationDate (expirationDate) {
    this.expirationDate = expirationDate
  }

  setAffectsShipping (affectsShipping) {
    this.affectsShipping = affectsShipping
  }

  setCode (code) {
    this.code = code
  }

  addOrder (order) {
    if (this.orders === undefined) {
      this.orders = []
    }

    if (this.orders.includes(order)) return

    this.orders.push(order)
  }

  removeOrder (order) {
    if (this.orders === undefined) return

    this.orders = this.orders.filter(o => o !== order)
  }

  getTitle () {
    return this.title
  }

  getAffectedCategory () {
    return this.affectedCategory
  }

  getAffectedArticle () {
    return this.affectedArticle
  }

  getDescription () {
    return this.description
  }

  getDiscount () {
    return this.discount
  }

  getDateAdded () {
    return this.dateAdded
  }

  getExpirationDate () {
    return this.expirationDate
  }

  getAffectsShipping () {
    return this.affectsShipping
  }

  getCode () {
    return this.code
  }

  getOrders () {
    return this.orders
  }

  async create () {
    try {
      this.setActive(true)
      const sql = `INSERT INTO coupon (title, description, discount, date_added, date_expiration, code, active) VALUES ("${this.getTitle()}", "${this.getDescription()}", "${this.getDiscount()}", "${this.getDateAdded()}", "${this.getExpirationDate()}", "${this.getCode()}", 1);`
      const res = await db.query(sql)
      this.setID(res.insertId)

      for (let i = 0; i < this.getRoles().length; i++) {
        const ordersql = `INSERT INTO used_coupons (coupon_id, order_id, active) VALUES (${this.getID()}, ${this.getOrders()[i]}, 1);`
        await db.query(ordersql)
      }
      return res
    } catch (err) {
      throw new Error(err)
    }
  }

  async read (id) {
    try {
      const sql = `SELECT * FROM coupon WHERE ID = ${id} AND active <> 0;`
      const res = await db.query(sql)
      if (res.length > 0) {
        const coupon = res[0]
        const affectedCategory = new Category()
        await affectedCategory.read(coupon.affected_category_id)
        const affectedArticle = new Goods()
        await affectedArticle.read(coupon.affected_article_id)
        this.setID(coupon.ID)
        this.setTitle(coupon.title)
        this.setAffectedCategory(affectedCategory)
        this.setAffectedArticle(affectedArticle)
        this.setDescription(coupon.description)
        this.setDiscount(coupon.discount)
        this.setDateAdded(coupon.date_added)
        this.setExpirationDate(coupon.date_expiration)
        this.setAffectsShipping(coupon.affects_shipping)
        this.setCode(coupon.code)
        this.setActive(coupon.active)

        // Load orders
        const ordersql = `SELECT order_id FROM used_coupons WHERE coupon_id="${coupon.ID}" AND active <> 0;`
        const ordersRes = await db.query(ordersql)
        for (let i = 0; i < ordersRes.length; i++) {
          this.addOrder(ordersRes[i].order_id)
        }

        return this
      }
    } catch (err) {
      throw new Error(err)
    }

    return null
  }

  static async readAll () {
    try {
      const sql = 'SELECT ID FROM coupon WHERE active <> 0'
      const res = await db.query(sql)
      const coupons = []
      for (let i = 0; i < res.length; i++) {
        const coupon = new Coupon()
        await coupon.read(res[i].ID)
        coupons.push(coupon)
      }
      return coupons
    } catch (err) {
      throw new Error(err)
    }
  }

  async update () {
    try {
      const sql = `UPDATE coupon SET title="${this.getTitle()}", affected_category_id="${this.getAffectedCategory().getID()}", affected_article_id="${this.getAffectedArticle().getID()}", description="${this.getDescription()}" discount="${this.getDiscount()}" date_added="${this.getDateAdded()}" date_expiration="${this.getExpirationDate()}" affects_shipping="${this.getAffectsShipping()}" code="${this.getCode()}" active="${this.getActive()}" WHERE ID=${this.getID()};`
      const res = await db.query(sql)

      // Check if any orders have to be deleted
      const ordersql = `SELECT order_id FROM used_coupons WHERE coupon_id="${this.getID()}" AND active <> 0;`
      const ordersRes = await db.query(ordersql)
      const ordersToRemove = []
      for (let i = 0; i < ordersRes.length; i++) {
        if (!this.orders.includes(ordersRes[i].order_id)) {
          ordersToRemove.push(ordersRes[i].order_id)
        }
      }

      if (ordersToRemove.length > 0) {
        const remordersql = `UPDATE used_coupons SET active=0 WHERE order_id IN (${ordersToRemove.join()}) AND coupon_id=${this.getID()};`
        await db.query(remordersql)
      }
      return JSON.stringify(res)
    } catch (err) {
      throw new Error(err)
    }
  }

  async del () {
    this.setActive(false)
    await this.update()
  }
}

module.exports = Coupon
