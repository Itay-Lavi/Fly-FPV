global.HOSTNAME = process.env.HOSTNAME ?? 'http://localhost'
global.PORT = process.env.PORT ?? 80;
global.MONGODB_URL = process.env.MONGODB_URL ?? 'mongodb://itay:pass@127.0.0.1:27017';
global.SESSION_SECRET = process.env.SESSION_SECRET;
global.STRIPE_API_KEY = process.env.STRIPE_API_KEY;

global.CLOUD_NAME = process.env.CLOUD_NAME;
global.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
global.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

global.MAILER_USERNAME = process.env.MAILER_USERNAME;
global.MAILER_PASSWORD = process.env.MAILER_PASSWORD;

global.PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
global.PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
global.PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;