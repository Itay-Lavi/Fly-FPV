const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

let mongodbUrl = 'mongodb://localhost:27017';

if (process.env.MONGODB_URL) {
	mongodbUrl = process.env.MONGODB_URL;
}

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: mongodbUrl,
    databaseName: 'online-shop',
    collection: 'sessions',
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: 'super-secret123',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
