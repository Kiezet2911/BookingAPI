const Bannermodel = require("../model/Banner.model");

//Get List
exports.getAll = async (req, res) => {
  var data = await Bannermodel.findById("622f37caf3f4339337026992");
  res.send(data);
};

//Cập Nhật
exports.update = async (req, res) => {
  try {
    const check = [];
    let isNullAnh1 = req.body.Anh1 == null;
    check.push(!isNullAnh1);
    let isnodeAnh1 = req.body.Anh1 == "";
    check.push(!isnodeAnh1);
    let isStringAnh1 = typeof req.body.Anh1 == "string";
    check.push(isStringAnh1);
    let isNullAnh2 = req.body.Anh2 == null;
    check.push(!isNullAnh2);
    let isnodeAnh2 = req.body.Anh2 == "";
    check.push(!isnodeAnh2);
    let isStringAnh2 = typeof req.body.Anh2 == "string";
    check.push(isStringAnh2);
    let isNullAnh3 = req.body.Anh3 == null;
    check.push(!isNullAnh3);
    let isnodeAnh3 = req.body.Anh3 == "";
    check.push(!isnodeAnh3);
    let isStringAnh3 = typeof req.body.Anh3 == "string";
    check.push(isStringAnh3);

    const isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      Bannermodel.findByIdAndUpdate(
        "622f37caf3f4339337026992",
        {
          Anh1: req.body.Anh1,
          Anh2: req.body.Anh2,
          Anh3: req.body.Anh3,
        },
        (err, data) => {
          if (err) throw err;
          res.send(data);
        }
      );
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Cập Nhật 1 Ảnh
exports.update1IMAGE = async (req, res) => {
  try {
    const check = [];
    let isNullAnh1 = req.params.NameAnh == null;
    check.push(!isNullAnh1);
    let isnodeAnh1 = req.params.NameAnh == "";
    check.push(!isnodeAnh1);
    let isStringAnh1 = typeof req.params.NameAnh == "string";
    check.push(isStringAnh1);
    let isNullAnh2 = req.body.Image == null;
    check.push(!isNullAnh2);
    let isnodeAnh2 = req.body.Image == "";
    check.push(!isnodeAnh2);
    let isStringAnh2 = typeof req.body.Image == "string";
    check.push(isStringAnh2);
   
    const isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      if (req.params.NameAnh === "Anh1") {
        Bannermodel.findByIdAndUpdate(
          "622f37caf3f4339337026992",
          {
            Anh1: req.body.Image,
          },
          (err, data) => {
            if (err) throw err;
            res.send(data);
          }
        );
      } else if (req.params.NameAnh === "Anh2") {
        Bannermodel.findByIdAndUpdate(
          "622f37caf3f4339337026992",
          {
            Anh2: req.body.Image,
          },
          (err, data) => {
            if (err) throw err;
            res.send(data);
          }
        );
      }
      if (req.params.NameAnh === "Anh3") {
        Bannermodel.findByIdAndUpdate(
          "622f37caf3f4339337026992",
          {
            Anh3: req.body.Image,
          },
          (err, data) => {
            if (err) throw err;
            res.send(data);
          }
        );
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};
