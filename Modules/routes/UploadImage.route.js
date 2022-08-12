module.exports = function (app) {
  var controller = require("../controller/UploadImage.controller");
  const multer = require("multer");

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/upload')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ".png"
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

  //
  const imageUpload = multer({
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
        return cb(new Error("Please upload a Image"));
      }
      cb(undefined, true);
    },
    storage: storage,
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
