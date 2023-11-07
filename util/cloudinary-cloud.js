const cloudinary = require('cloudinary').v2;


	config = {
		cloud_name: CLOUD_NAME,
		api_key: CLOUD_API_KEY,
		api_secret: CLOUD_API_SECRET
	}

cloudinary.config(config);

async function uploadImage(filePath) {
  let result;
  try {
    result = await cloudinary.uploader.upload(filePath, {transformation: [{quality: 'auto'}]});
  } catch (error) {
    throw error;
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
