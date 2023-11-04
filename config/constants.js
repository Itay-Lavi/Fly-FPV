global.HOSTNAME = process.env.HOSTNAME ?? 'localhost'
global.PORT = process.env.PORT ?? 80;
global.MONGODB_URL = process.env.MONGODB_URL ?? 'mongodb://user:pass@127.0.0.1:27017';
global.SESSION_SECRET = process.env.SESSION_SECRET;
global.STRIPE_API_KEY = process.env.STRIPE_API_KEY;

global.CLOUD_NAME = process.env.CLOUD_NAME;
global.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
global.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;