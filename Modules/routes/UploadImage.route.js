module.exports = function (app) {
  var controller = require("../controller/UploadImage.controller");
  const multer = require("multer");
  const FirebaseStorage = require('multer-firebase-storage')
  const FBconfigStorage = require('../../config/firebase');
  //config Storage Để Đẩy Ảnh Lên Amazon S3
  const configStorage = FirebaseStorage(FBconfigStorage);
  //
  const imageUpload = multer({
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
        return cb(new Error("Please upload a Image"));
      }
      cb(undefined, true);
    },
    storage: configStorage,
    limits: {
      fileSize: 10000000, // 10000000 Bytes = 10 MB
    },
  });

  //Get open img
  app.get("/open-image/:filename", controller.loadimgage);

  //upload
  app.post(
    "/upload-image",
    imageUpload.single("img"),
    controller.UploadImage,
    (error, req, res, next) => {
      res.status(400).send({ error: error.message });
    }
  );
};
