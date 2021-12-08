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

  static async read() {
    throw new Error("Method read() must be implemented.");
  }

  async update() {
    throw new Error("Method update() must be implemented.");
  }

  async del() {
    throw new Error("Method del() must be implemented.");
  }

  setID(ID) {
    this.ID = ID;
  }

  getID() {
    return this.ID;
  }

  setActive(active) {
    if(active === true) {
      this.active = 1;
    } else if(active === false) {
      this.active = 0;
    } else if(active === 0 || active === 1) {
      this.active = active
    }
  }

  getActive() {
    return this.active;
  }
}

module.exports = {
  Model: Model
}
