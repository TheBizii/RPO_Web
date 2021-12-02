const model = require('../model');
const post = require('post');

const Model = model.Model;
const Post = post.Post;

class Address extends Model {
  constructor() {
    super();
  }

  setAddress(address) {
    this.address = address;
  }

  setPost(post) {
    if(post.constructor === Post) {
      this.post = post;
    } else {
      throw new Error(`Got ${post.constructor}, expected object of type Post.`);
    }
  }

  getAddress() {
    return this.address;
  }

  getPost() {
    return this.post;
  }
}

module.exports = {
  Address: Address
}
