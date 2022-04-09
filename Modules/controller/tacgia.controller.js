const tacgiamodel = require("../model/tacgia.model");
const sachmodel = require("../model/sach.model");
//Get List
exports.getAll = async (req, res) => {
  var data = await tacgiamodel.find({ status: false });
  res.send(data);
};

//Get by id
exports.getbyid = async (req, res) => {
  try {
    let check = [];
    let isNullid = req.params.id == null;
    check.push(!isNullid);
    let isStringid = typeof req.params.id == "string";
    check.push(isStringid);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = await tacgiamodel.findById(req.params.id);
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
    let isNullTenTG = req.body.TenTG == null;
    check.push(!isNullTenTG);
    let isStringTenTG = typeof req.body.TenTG == "string";
    check.push(isStringTenTG);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = new tacgiamodel(req.body);
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
    let isNullid = req.body.id == null;
    check.push(!isNullid);
    let isStringid = typeof req.body.id == "string";
    check.push(isStringid);
    let isNullTenTG = req.body.TenTG == null;
    check.push(!isNullTenTG);
    let isStringTenTG = typeof req.body.TenTG == "string";
    check.push(isStringTenTG);
    let isNullDiachi = req.body.Diachi == null;
    check.push(!isNullDiachi);
    let isStringDiachi = typeof req.body.Diachi == "string";
    check.push(isStringDiachi);
    let isNullTieusu = req.body.Tieusu == null;
    check.push(!isNullTieusu);
    let isStringTieusu = typeof req.body.Tieusu == "string";
    check.push(isStringTieusu);
    let isNullDienthoai = req.body.Dienthoai == null;
    check.push(!isNullDienthoai);
    let isStringDienthoai = typeof req.body.Dienthoai == "string";
    check.push(isStringDienthoai);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      tacgiamodel.findByIdAndUpdate(
        req.body.id,
        {
          TenTG: req.body.TenTG,
          Diachi: req.body.Diachi,
          Tieusu: req.body.Tieusu,
          Dienthoai: req.body.Dienthoai,
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
    let isNullid = req.params.id == null;
    check.push(!isNullid);
    let isStringid = typeof req.params.id == "string";
    check.push(isStringid);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      await sachmodel.updateMany({ MaTacGia: req.params.id }, { status: true });
      await tacgiamodel.findByIdAndUpdate(req.params.id, { status: true });
      res.send({ Messager: "Xóa Thành Công" });
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};
