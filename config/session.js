const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

let mongodbUrl = 'mongodb://localhost:27017';
if (process.env.MONGODB_URL) {
	mongodbUrl = process.env.MONGODB_URL;
}

let sessionSecret = 'super-secret123';
if (process.env.SESSION_SECRET) {
	sessionSecret = process.env.SESSION_SECRET;
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
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
