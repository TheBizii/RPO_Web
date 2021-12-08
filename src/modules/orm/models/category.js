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
}

module.exports = Category;
