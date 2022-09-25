const cloudinary = require('cloudinary').v2;

let config = {
	cloud_name: 'dkvvhhtsq',
	api_key: '979292225885687',
    api_secret: 'ZweG_9GYbPgVeEj4tx8G2p453GI'
}
if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
	config = {
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUD_API_KEY,
		api_secret: process.env.CLOUD_API_SECRET
	}
}

cloudinary.config(config);

async function uploadImage(filePath) {
  let result;
  try {
    result = await cloudinary.uploader.upload(filePath);
  } catch (error) {
    return error;
  }

  return result;
}

async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    return error;
  }
}

module.exports = {
  uploadImage: uploadImage,
  deleteImage: deleteImage
};
