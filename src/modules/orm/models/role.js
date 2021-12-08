const model = require('../model');

const Model = model.Model;

class Role extends Model {
  constructor() {
    super();
  }

  setType(type) {
    this.type = type;
  }

  getType() {
    return this.type;
  }
}

module.exports = Role;
