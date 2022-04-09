const nhaxuatban = require("../model/nhaxuatban.model");
const sachmodel = require("../model/sach.model");
//Get List
exports.getAll = async (req, res) => {
  var data = await nhaxuatban.find({ status: false });
  res.send(data);
};

//Get by id
exports.getbyid = async (req, res) => {
  try {
    let check = [];
    let isNull = req.params.id == null;
    check.push(!isNull);
    let isString = typeof req.params.id == "string";
    check.push(isString);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = await nhaxuatban.findById(req.params.id);
      res.send(data);
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Thêm Mới
exports.insert = async (req, res) => {
  try {
    let check = [];
    let isNullTenNXB = req.body.TenNXB == null;
    check.push(!isNullTenNXB);
    let isStringTenNXB = typeof req.body.TenNXB == "string";
    check.push(isStringTenNXB);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = new nhaxuatban(req.body);
      data.save();
      res.send(data);
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Cập Nhật
exports.update = async (req, res) => {
  try {
    let check = [];
    let isNull = req.body.id == null;
    check.push(!isNull);
    let isString = typeof req.body.id == "string";
    check.push(isString);
    let isNullTenNXB = req.body.TenNXB == null;
    check.push(!isNullTenNXB);
    let isStringTenNXB = typeof req.body.TenNXB == "string";
    check.push(isStringTenNXB);
    let isNullDiachi = req.body.Diachi == null;
    check.push(!isNullDiachi);
    let isStringDiachi = typeof req.body.Diachi == "string";
    check.push(isStringDiachi);
    let isNullDienThoai = req.body.DienThoai == null;
    check.push(!isNullDienThoai);
    let isStringDienThoai = typeof req.body.DienThoai == "string";
    check.push(isStringDienThoai);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      nhaxuatban.findByIdAndUpdate(
        req.body.id,
        {
          TenNXB: req.body.TenNXB,
          Diachi: req.body.Diachi,
          DienThoai: req.body.DienThoai,
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

//Xóa theo id
exports.deletebyid = async (req, res) => {
  try {
    let check = [];
    let isNull = req.params.id == null;
    check.push(!isNull);
    let isString = typeof req.params.id == "string";
    check.push(isString);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = await nhaxuatban.findByIdAndUpdate(req.params.id, { status: true });
      var databook = await sachmodel.updateMany(
        { MaNXB: req.params.id },
        { status: true }
      );
      res.send({ Messager: "Xóa Thành Công" });
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};
