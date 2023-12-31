const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URL);
  database = client.db('online-shop');
}

function getDb() {
  if (!database) {
    throw new Error('You must connect first to database!');
  }
  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
