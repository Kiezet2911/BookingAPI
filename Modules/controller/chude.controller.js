const chudemodel = require("../model/chude.model");
const sachmodel = require("../model/sach.model");

//Get List
exports.getAll = async (req, res) => {
  var data = await chudemodel.find({ status: false });
  res.send(data);
};

//Get by id
exports.getbyid = async (req, res) => {
  try {
    if (typeof req.params.id == "string" && req.params.id != null) {
      var data = await chudemodel.findById(req.params.id);
      res.send(data);
    } else {
      res.send({ Messager: "Id Sai Định Dạng Hoặc Null" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Get by name
exports.getbyname = async (req, res) => {
  try {
    if (typeof req.params.name == "string" && req.params.name != null) {
      chudemodel.find(
        { $text: { $search: `\"${req.params.name}\"` }, status: false },
        (err, data) => {
          if (err) throw err;

          res.send(data);
        }
      );
    } else {
      res.send({ Messager: "name Sai Định Dạng Hoặc Null" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Thêm Mới
exports.insert = async (req, res) => {
  try {
    if (typeof req.body.TenChuDe == "string" && req.body.TenChuDe) {
      let data = await chudemodel.find({
        $text: { $search: `\"${req.body.TenChuDe}\"` },
      });
      if (data.length <= 0) {
        var datachude = new chudemodel(req.body);
        datachude.save();
        res.send(datachude);
      } else {
        res.send({ Messager: "Không Thể Thêm Chủ Đề Đã Có" });
      }
    } else {
      res.send({ Messager: "TenChuDe Sai Định Dạng Hoặc Null" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Cập Nhật
exports.update = async (req, res) => {
  try {
    const check = [];
    let isNull = req.body.TenChuDe == null;
    check.push(!isNull);
    let isNull_id = req.body.id == null;
    check.push(!isNull_id);
    let isnone_id = req.body.id == "";
    check.push(!isnone_id);
    let isnode = req.body.TenChuDe == "";
    check.push(!isnode);
    let isString = typeof req.body.TenChuDe == "string";
    check.push(isString);

    const isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      chudemodel.findByIdAndUpdate(
        req.body.id,
        {
          TenChuDe: req.body.TenChuDe,
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
    let isnone_id = req.params.id == "";
    check.push(!isnone_id);
    let isString = typeof req.params.id == "string";
    check.push(isString);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      await sachmodel.updateMany({ MaCD: req.params.id }, { status: true });
      await chudemodel.findByIdAndUpdate(req.params.id, { status: true });
      res.send({ Messager: "Xóa Thành Công" });
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};
