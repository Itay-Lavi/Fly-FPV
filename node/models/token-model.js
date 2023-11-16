const crypto = require('crypto');
const db = require('../data/database');

class PasswordResetToken {
  constructor(data) {
    if (!data.userId) {
      throw new Error('userId must be provided!');
    }

    this.userId = data.userId;
    this.token = data.token;

    if (!data.token) {
      this.token = this.generateToken();
    }

    if (data._id) {
      this.id = data._id.toString();
    }
  }

  static objectToModel(data) {
    if (!data) {
      const error = new Error('Could not find token with provided id');
      error.code = 404;
      throw error;
    }
    return new PasswordResetToken(data);
  }

  static async findToken(token) {
    const resetTokensCollection = db.getDb().collection('resetTokens');
    const result = await resetTokensCollection.findOne({ token });
    return PasswordResetToken.objectToModel(result);
  }

   static async deleteExpiredTokens() {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const resetTokensCollection = db.getDb().collection('resetTokens');
    return await resetTokensCollection.deleteMany({
      createdAt: { $lt: twentyFourHoursAgo },
    });
  }

  async saveToken() {
    const resetTokensCollection = db.getDb().collection('resetTokens');

    try {
      resetTokensCollection.deleteMany({ userId: this.userId });
    } catch (e) {}

    const result = await resetTokensCollection.insertOne({
      userId: this.userId,
      token: this.token,
      createdAt: new Date(),
    });
    return result;
  }

  async deleteToken() {
    const resetTokensCollection = db.getDb().collection('resetTokens');
    return await resetTokensCollection.deleteOne({ token: this.token });
  }

  generateToken() {
    return crypto.randomBytes(20).toString('hex');
  }
}

module.exports = PasswordResetToken;
