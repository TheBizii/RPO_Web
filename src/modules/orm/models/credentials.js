const model = require('../model');

const Model = model.Model;

class Credentials extends Model {
  constructor() {
    super();
  }

  setEmail(email) {
    this.email = email;
  }

  // TODO: Move this to user model
  setUser(user) {
    if(user.constructor === User) {
      this.user = user;
    } else {
      throw new Error(`Got ${user.constructor}, expected object of type User.`);
    }
  }

  setPassword(password) {
    this.password = password;
  }

  setSalt(salt) {
    this.salt = salt;
  }
}

module.exports = Credentials;
