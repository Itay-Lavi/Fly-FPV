const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: MONGODB_URL,
    databaseName: 'online-shop',
    collection: 'sessions',
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
