class Model {
  constructor() {
    if(this.constructor === Model) {
      throw new Error("Can not instantiate abstract class!");
    } else {
      this.active = true;
    }
  }

  create() {
    throw new Error("Method create() must be implemented.");
  }

  read() {
    throw new Error("Method read() must be implemented.");
  }

  update() {
    throw new Error("Method update() must be implemented.");
  }

  del() {
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
