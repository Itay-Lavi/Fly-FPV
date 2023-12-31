const fs = require('fs/promises');
const path = require('path');
const cloudinary = require('../util/cloudinary-cloud');

const { ObjectId } = require('mongodb');

const db = require('../data/database');

class Product {
  static productCategories = [
    'All',
    'Drones',
    'Goggles',
    'RC Radio',
    'Battery',
    'Accessories',
  ];

  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.category = productData.category ?? 'All';
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image;
    this.imageUrl = productData.imageUrl;
    this.publicId = productData.publicId;
    this.slider = productData.slider;
    this.complementaries = productData.complementaries;
    this.updateImagePath();

    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  updateImagePath() {
    this.imagePath = `product-data/images/${this.image}`;
  }

  static isCategoryValid(category) {
    return this.productCategories.some(
      (item) => item.toLowerCase() === category.toLowerCase()
    );
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection('products')
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error('Could not find product with provided id');
      error.code = 404;
      throw error;
    }
    return new Product(product);
  }

  static async findAll() {
    const products = await db.getDb().collection('products').find().toArray();

    return products.map(function (productDoc) {
      return new Product(productDoc);
    });
  }

  static async findByCategory(category) {
    const products = await db
      .getDb()
      .collection('products')
      .find({ category: { $regex: new RegExp(category, 'i') } })
      .toArray();
      return products.map(function (productDoc) {
        return new Product(productDoc);
      });
  }

  static async findBySearch(search) {
    const regex = new RegExp(search, 'i');
    return await db
      .getDb()
      .collection('products')
      .find({ $or: [{ title: regex }, { summary: regex }, { category: regex }] })
      .toArray();
  }

  static async findAllSlides() {
    const products = await db
      .getDb()
      .collection('products')
      .find({ slider: true })
      .toArray();
    return products.map(function (productDoc) {
      return new Product(productDoc);
    });
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function (id) {
      return new ObjectId(id);
    });

    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  async handleSlider(slider) {
    const productData = { slider };
    const productId = new ObjectId(this.id);
    await db
      .getDb()
      .collection('products')
      .updateOne({ _id: productId }, { $set: productData });
  }

  async handleComplementary(complementaryProdId, actionType = true) {
    const update = {};
    update[actionType ? '$push' : '$pull'] = {
        'complementaries': new ObjectId(complementaryProdId),
    };
    const productId = new ObjectId(this.id);
    await db
      .getDb()
      .collection('products')
      .updateOne({ _id: productId }, update);
  }

  async save() {
    const productData = {
      title: this.title,
      category: this.category,
      summary: this.summary,
      price: this.price,
      description: this.description,
      slider: this.slider,
    };

    try {
      if (this.id) {
        // Updating existing product
        const productId = new ObjectId(this.id);

        if (this.image) {
          const result = await cloudinary.uploadImage(this.imagePath);
          productData.imageUrl = result.secure_url;
          productData.publicId = result.public_id;
          this.deleteLocalImage();
        } else {
          // If no new image, do not update image fields
          delete productData.imageUrl;
          delete productData.publicId;
        }

        await db
          .getDb()
          .collection('products')
          .updateOne({ _id: productId }, { $set: productData });
      } else {
        // Creating a new product
        if (this.image) {
          const result = await cloudinary.uploadImage(this.imagePath);
          productData.imageUrl = result.secure_url;
          productData.publicId = result.public_id;
          this.deleteLocalImage();
        }

        await db.getDb().collection('products').insertOne(productData);
      }
    } catch (error) {
      this.deleteLocalImage();
      console.error('Error occurred while saving product:', error);
      throw error;
    }
  }

  async replaceImage(newImage) {
    this.image = newImage;
    this.updateImagePath();
  }

  async delete() {
    const productId = new ObjectId(this.id);
    await db.getDb().collection('products').deleteOne({ _id: productId });

    await this.deleteCloudImage();
    await this.deleteLocalImage();
  }

  async deleteLocalImage() {
    const imageFullPath = path.join(__dirname, '..', this.imagePath);
    try {
      await fs.unlink(imageFullPath);
      this.image = null;
      this.updateImagePath();
    } catch {}
  }

  async deleteCloudImage() {
    await cloudinary.deleteImage(this.publicId);
  }
}

module.exports = Product;
