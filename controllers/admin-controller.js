const Product = require('../models/product-model');
const Order = require('../models/order-model')
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
	const sessionErrorData = sessionFlash.getSessionData(req, {
		title: '',
		summary: '',
		price: '',
		description: '',
	  });

  res.render('admin/products/new-product', { product: sessionErrorData });
}

async function createNewProduct(req, res, next) {
	const formData = { ...req.body, image: req.file.filename };
	const product = new Product(formData);

  if (!req.file || !validation.productDetailsIsValid(req.body)) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: 'Invalid - please check your data.',
        ...req.body,
      },
      async function () {
		try {
			await product.deleteImage();
		} catch {}
        res.redirect('/admin/products/new');
      }
    );

    return;
  }


  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
  } catch (error) {
    next(error);
  }

   const sessionErrorData = sessionFlash.getSessionData(req, product);

  res.render('admin/products/update-product', { product: sessionErrorData });
}

async function updateProduct(req, res, next) {
  const formData = { ...req.body, _id: req.params.id };
  const product = new Product(formData);

  if (!validation.productDetailsIsValid(formData)) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: 'Invalid - please check your data.',
        ...product,
      },
	  async function () {
		try {
			await product.deleteImage();
		} catch {}
        res.redirect('/admin/products/' + product.id);
      }
    );
    return;
  }


  if (req.file) {
    try {
      const oldProduct = await Product.findById(req.params.id);
      oldProduct.deleteImage();
    } catch (error) {
      next(error);
      return;
    }

    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    await product.delete();
  } catch (error) {
    res.status(500).json({ message: 'Error!' });
    return;
  }

  res.json({ message: 'Product deleted!' });
}

async function getOrders(req, res, next) {
	try {
	  const orders = await Order.findAll();
	  res.render('admin/orders/admin-orders', {
		orders: orders
	  });
	} catch (error) {
	  next(error);
	}
  }
  
  async function updateOrder(req, res, next) {
	const orderId = req.params.id;
	const newStatus = req.body.newStatus;
  
	try {
	  const order = await Order.findById(orderId);
  
	  order.status = newStatus;
  
	  await order.save();
  
	  res.json({ message: 'Order updated', newStatus: newStatus });
	} catch (error) {
	  next(error);
	}
  }

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
};
