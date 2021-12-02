const model = require('../model');

const Model = model.Model;

class State extends Model {
  constructor() {
    super();
  }

  setTitle(title) {
    this.title = title;
  }

  getTitle() {
    return this.title;
  }
}

module.exports = {
  State: State
}
