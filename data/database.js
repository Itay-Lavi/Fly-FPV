const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let mongodbUrl = 'mongodb://localhost:27017';
let srvMongodbUrl = 'mongodb+srv://WDE:Eb7514804@cluster0.bwa2nw4.mongodb.net/?retryWrites=true&w=majority';

if (process.env.MONGODB_URL) {
	mongodbUrl = process.env.MONGODB_URL;
}

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(srvMongodbUrl);
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
