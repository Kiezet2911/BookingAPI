const fs = require("fs");

//Get List
exports.UploadImage = async (req, res) => {
  if (typeof req.file == "undefined") {
    res.send({ Messager: "Không tìm thấy ảnh trong kho" });
  } else {
    res.send({ data: req.file.publicUrl });
  }
};

exports.loadimgage = async (req, res) => {
  let imgpath = "images/" + req.params.filename;
  fs.readFile(imgpath, (err, data) => {
    if (err) {
      res.send({ Messager: "Không tìm thấy ảnh trong kho" });
    } else {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data);
    }
  });
};
