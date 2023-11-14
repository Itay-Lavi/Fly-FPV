const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

const db = require('../data/database');

class User {
  constructor(userData) {
    this.email = userData.email;
    this.password = userData.password;
    this.name = userData.name;
    this.address = userData.address;

    if (userData._id) {
      this.id = userData._id.toString();
    }
  }

  static objectToUser(userData) {
    if (!userData) {
      const error = new Error('Could not find user with provided id');
      error.code = 404;
      throw error;
    }
    return new User(userData);
  }

  static async findById(userId) {
    const uid = new ObjectId(userId);

    const user = await db
      .getDb()
      .collection('users')
      .findOne({ _id: uid }, { projection: { password: 0 } });

 
    return User.objectToUser(user);
  }

  static async findByEmail(email) {
    const user = await db
      .getDb()
      .collection('users')
      .findOne({ email: email }, { projection: { password: 0 } });

    return User.objectToUser(user);
  }

  getUserWithSameEmail() {
    return db.getDb().collection('users').findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await this.hashPassword(this.password);

    const result = await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
    return result;
  }

  async changePassword(newPassword) {
    const hashedPassword = await this.hashPassword(newPassword);
    const result = await db
      .getDb()
      .collection('users')
      .updateOne({ _id: new ObjectId(this.id) }, { $set: { password: hashedPassword } });
    return result;
  }

   hashPassword(password) {
   return bcrypt.hash(password, 12);
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
