const { ObjectId } = require("mongodb");
const DonDatHangmodel = require("../model/CTDonHang.model");
const sachmodel = require("../model/sach.model");

//Get List
exports.getAll = async (req, res) => {
  var data = await DonDatHangmodel.find();
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
      var data = await DonDatHangmodel.aggregate([
        { $match: { MaDonHang: ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "saches",
            localField: "Masach",
            foreignField: "_id",
            as: "sach",
          },
        },
        {
          $lookup: {
            from: "dondathangs",
            localField: "MaDonHang",
            foreignField: "_id",
            as: "DH",
          },
        },
        {
          $unwind: "$sach",
        },
        {
          $unwind: "$DH",
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            MaDonHang: "$MaDonHang",
            Tensach: "$sach.Tensach",
            Anhbia: "$sach.Anhbia",
            Ngaydat: "$DH.Ngaydat",
            Soluong: "$Soluong",
            Dongia: "$Dongia",
          },
        },
      ]);
      res.send(data);
      console.log(data);
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
    let isNull_MaDonHang = req.body.MaDonHang == null;
    check.push(!isNull_MaDonHang);
    let isString_MaDonHang = typeof req.body.MaDonHang == "string";
    check.push(isString_MaDonHang);
    let isNull_Masach = req.body.Masach == null;
    check.push(!isNull_Masach);
    let isString_Masach = typeof req.body.Masach == "string";
    check.push(isString_Masach);
    let isNull_Soluong = req.body.Soluong == null;
    check.push(!isNull_Soluong);
    let isNum_Soluong = typeof req.body.Soluong == "number";
    check.push(isNum_Soluong);
    let isNull_Dongia = req.body.Dongia == null;
    check.push(!isNull_Dongia);
    let isNum_Dongia = typeof req.body.Dongia == "number";
    check.push(isNum_Dongia);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var dataSach = await sachmodel.findById(req.body.Masach);
      var data = new DonDatHangmodel(req.body);
      data.save();
      const slnton = dataSach.Soluongton - req.body.Soluong;
      var slnban = 0;
      if (typeof dataSach.soluongban == "number") {
        slnban = dataSach.soluongban + req.body.Soluong;
      } else {
        slnban = req.body.Soluong;
      }
      await sachmodel.findByIdAndUpdate(req.body.Masach, {
        Soluongton: slnton,
        soluongban: slnban,
      });
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
    let isNullSoluong = req.body.Soluong == null;
    check.push(!isNullSoluong);
    let isStringSoluong = typeof req.body.Soluong == "number";
    check.push(isStringSoluong);
    let isNullDongia = req.body.Dongia == null;
    check.push(!isNullDongia);
    let isStringDongia = typeof req.body.Dongia == "number";
    check.push(isStringDongia);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      DonDatHangmodel.findByIdAndUpdate(
        req.body.id,
        {
          Soluong: req.body.Soluong,
          Dongia: req.body.Dongia,
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

//Xóa theo id Của Đơn Hàng
exports.deletebyid = async (req, res) => {
  try {
    let check = [];
    let isNull = req.params.id == null;
    check.push(!isNull);
    let isString = typeof req.params.id == "string";
    check.push(isString);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = await DonDatHangmodel.deleteMany({
        MaDonHang: ObjectId(req.params.id),
      });
      res.send(data);
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};
