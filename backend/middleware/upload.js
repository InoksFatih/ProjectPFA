const path = require('path');
const multer = require('multer');

const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const diskUpload = multer({ storage: diskStorage });

module.exports = {
  memoryUpload,
  diskUpload
};
