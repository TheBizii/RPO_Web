class Model {
  constructor() {
    if(this.constructor === Model) {
      throw new Error("Can not instantiate abstract class!");
    } else {
      this.active = true;
    }
  }

  async create() {
    throw new Error("Method create() must be implemented.");
  }

  async read() {
    throw new Error("Method read() must be implemented.");
  }

  async update() {
    throw new Error("Method update() must be implemented.");
  }

  async del() {
    throw new Error("Method del() must be implemented.");
  }

  getID() {
    return this.ID;
  }

  setActive(active) {
    this.active = active;
  }

  getActive() {
    return this.active;
  }
}

module.exports = {
  Model: Model
}
