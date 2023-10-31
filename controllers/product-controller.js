const Product = require('../models/product-model');

const slides = [
  {
      imageUrl: "https://res.cloudinary.com/dkvvhhtsq/image/upload/v1698679810/axwb2bm2cdunu79h2nqn.jpg",
      alt: "Slide 1",
      title: "DJI FPV Drone",
      price: "$1299.99"
  },
  {
      imageUrl: "https://res.cloudinary.com/dkvvhhtsq/image/upload/v1698750003/ovfkzjmg9ap1eb2jgzl3.jpg",
      alt: "Slide 2",
      title: "Ultimate 5-Inch Racer Drone",
      price: "$250"
  },
  {
      imageUrl: "https://res.cloudinary.com/dkvvhhtsq/image/upload/v1698680083/zgqwolnmjuzds6o01as3.jpg",
      alt: "Slide 3",
      title: "Tattu R-Line 1300mAh 120C LiPo",
      price: "$30"
  }
];
async function getAllProducts(req, res, next) {


  try {
    const products = await Product.findAll();
    res.render('customer/products/all-products', { products, slides });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req,res,next) {
	try {
		const product = await Product.findById(req.params.id);
		res.render('customer/products/product-details', { product: product });
	} catch(error) {
		next(error)
	}
	
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails
};
