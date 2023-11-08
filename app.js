const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

require('./config/constants');

const createSessionConfig = require('./config/session');
const db = require('./data/database');

const addCsrfTokenMiddleware = require('./middlewares/csrf-token-middleware');
const errorHandlerMiddleware = require('./middlewares/error-handler-middleware');
const checkAuthStatusMiddleware = require('./middlewares/auth-check-middleware');
const protectRoutesMiddleware = require('./middlewares/protect-routes-middleware');
const cartMiddleware = require('./middlewares/cart-middleware');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found-middleware');
const addProdctCategoriesMiddleware = require('./middlewares/product-categories-middleware');

const authRoutes = require('./routes/auth-routes');
const productsRoutes = require('./routes/products-routes');
const baseRoutes = require('./routes/base-routes');
const adminRoutes = require('./routes/admin-routes');
const cartRoutes = require('./routes/cart-routes');
const ordersRoutes = require('./routes/orders-routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(addProdctCategoriesMiddleware);
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use(protectRoutesMiddleware);
app.use('/orders', ordersRoutes);
app.use('/admin', adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(PORT);
    console.log('listening on port ' + PORT);
  })
  .catch(function (error) {
    console.log('Failed to connect to database!');
    console.log(error);
  });
