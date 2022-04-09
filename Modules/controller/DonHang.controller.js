const { ObjectId } = require("mongodb");
const DonDatHangmodel = require("../model/DonHang.model");
const sachmodel = require("../model/sach.model");

//Get List
exports.getAll = async (req, res) => {
  var data = await DonDatHangmodel.aggregate([
    { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
    {
      $lookup: {
        from: "khachhangs",
        localField: "MaKH",
        foreignField: "_id",
        as: "KH",
      },
    },
    {
      $unwind: "$KH",
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        HoTen: "$KH.HoTen",
        TongTien: "$TongTien",
        Ngaydat: 1,
        Tinhtranggiaohang: 1,
      },
    },
  ]);
  if (data.length <= 0) {
    res.status(404).send(" Not Found ");
  } else {
    res.send(data);
  }
};

//Get Pagination
exports.getAllPagination = async (req, res) => {
  const page = req.params.page;
  const limit = req.params.limit;
  var data = await DonDatHangmodel.aggregate([
    { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
    {
      $lookup: {
        from: "khachhangs",
        localField: "MaKH",
        foreignField: "_id",
        as: "KH",
      },
    },
    {
      $unwind: "$KH",
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        HoTen: "$KH.HoTen",
        TongTien: "$TongTien",
        Tinhtranggiaohang: 1,
        Ngaydat: 1,
      },
    },
  ])
    .skip((page - 1) * limit)
    .limit(limit * 1);
  if (data.length <= 0) {
    res.status(404).send(" Not Found ");
  } else {
    res.send(data);
  }
};

//Get Pagination By Date
exports.PhanTrangDonHang = async (req, res) => {
  const page = req.params.page;
  const limit = req.params.limit;
  const count = await DonDatHangmodel.find({
    MaKH: req.params.idKH,
    Ngaydat: {
      $gte: new Date(req.params.Ngaydat),
      $lte: new Date(req.params.GioiHan),
    },
  }).count();

  if (count == 0) {
    res.send({ Messager: "Hiện Chưa Có Đơn Hàng Trong Khoảng Thời Gian Này" });
  } else {
    var data = await DonDatHangmodel.aggregate([
      { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
      {
        $match: {
          Ngaydat: {
            $gte: new Date(req.params.Ngaydat),
            $lte: new Date(req.params.GioiHan),
          },
        },
      },
      { $match: { MaKH: ObjectId(req.params.idKH) } },
      {
        $lookup: {
          from: "khachhangs",
          localField: "MaKH",
          foreignField: "_id",
          as: "KH",
        },
      },
      {
        $unwind: "$KH",
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          HoTen: "$KH.HoTen",
          TongTien: "$TongTien",
          Tinhtranggiaohang: 1,
          Ngaydat: 1,
        },
      },
    ])
      .skip((page - 1) * limit)
      .limit(limit * 1);
    res.send({ data: data, count: count });
  }
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
      var data = await DonDatHangmodel.aggregate([
        { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
        { $match: { _id: ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "khachhangs",
            localField: "MaKH",
            foreignField: "_id",
            as: "KH",
          },
        },
        {
          $unwind: "$KH",
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            HoTen: "$KH.HoTen",
            Ngaydat: 1,
            Ngaygiao: 1,
            Tinhtranggiaohang: 1,
            TongTien: 1,
          },
        },
      ]);
      if (data.length <= 0) {
        res.status(404).send(" Not Found ");
      } else {
        res.send(data);
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Get by idKH
exports.getbyidKH = async (req, res) => {
  try {
    let check = [];
    let isNullidKH = req.params.idKH == null;
    check.push(!isNullidKH);
    let isStringidKH = typeof req.params.idKH == "string";
    check.push(isStringidKH);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = await DonDatHangmodel.find({
        MaKH: req.params.idKH,
      });
      if (data.length <= 0) {
        res.status(404).send(" Not Found ");
      } else {
        res.send(data);
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Get by idKH và Phân Trang
exports.getbyidKHPhanTrang = async (req, res) => {
  try {
    let check = [];
    let isNullidKH = req.params.idKH == null;
    check.push(!isNullidKH);
    let isStringidKH = typeof req.params.idKH == "string";
    check.push(isStringidKH);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      const page = req.params.page;
      const limit = req.params.limit;
      var count = await DonDatHangmodel.find({
        MaKH: req.params.idKH,
      }).count();
      if (count == 0) {
        res.send({ Messager: "Hiện Bạn Chưa Có Đơn Hàng Nào" });
      } else {
        var data = await DonDatHangmodel.find({
          MaKH: req.params.idKH,
        })
          .skip((page - 1) * limit)
          .limit(limit * 1);
        res.send({ data: data, count: count });
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Get by idKH theo ngày
exports.getbyidKHDate = async (req, res) => {
  try {
    let check = [];
    let isNullidKH = req.params.idKH == null;
    check.push(!isNullidKH);
    let isStringidKH = typeof req.params.idKH == "string";
    check.push(isStringidKH);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = await DonDatHangmodel.find({
        MaKH: req.params.idKH,
        Ngaydat: {
          $gte: new Date(req.params.Ngaydat),
          $lte: new Date(req.params.GioiHan),
        },
      });
      if (data.length <= 0) {
        res.status(404).send(" Not Found ");
      } else {
        res.send(data);
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Get Pagination có count
exports.getAllPaginationHaveCount = async (req, res) => {
  const page = req.params.page;
  const limit = req.params.limit;
  let count = await DonDatHangmodel.find().count();
  if (count == 0) {
    res.send({ Messager: "Không Có Sách Này" });
  } else {
    var data = await DonDatHangmodel.aggregate([
      { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
      {
        $lookup: {
          from: "khachhangs",
          localField: "MaKH",
          foreignField: "_id",
          as: "KH",
        },
      },
      {
        $unwind: "$KH",
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          HoTen: "$KH.HoTen",
          TongTien: "$TongTien",
          Tinhtranggiaohang: 1,
          Ngaydat: 1,
        },
      },
    ])
      .skip((page - 1) * limit)
      .limit(limit * 1);
    res.send({ data: data, count: count });
  }
};

//Thêm Mới
exports.insert = async (req, res) => {
  try {
    let check = [];
    let isNullDathanhtoan = req.body.Dathanhtoan == null;
    check.push(!isNullDathanhtoan);
    let isStringDathanhtoan = typeof req.body.Dathanhtoan == "boolean";
    check.push(isStringDathanhtoan);
    let isNullTinhtranggiaohang = req.body.Tinhtranggiaohang == null;
    check.push(!isNullTinhtranggiaohang);
    let isStringTinhtranggiaohang =
      typeof req.body.Tinhtranggiaohang == "boolean";
    check.push(isStringTinhtranggiaohang);
    let isNullNgaydat = req.body.Ngaydat == null;
    check.push(!isNullNgaydat);
    let isStringNgaydat = typeof req.body.Ngaydat == "string";
    check.push(isStringNgaydat);
    let isNullMaKH = req.body.MaKH == null;
    check.push(!isNullMaKH);
    let isStringMaKH = typeof req.body.MaKH == "string";
    check.push(isStringMaKH);
    let isNulTongTien = req.body.TongTien == null;
    check.push(!isNulTongTien);
    let isNumTongTien = typeof req.body.TongTien == "number";
    check.push(isNumTongTien);
    let isNulMasachCheck = req.body.MasachCheck == null;
    check.push(!isNulMasachCheck);
    let isNumMasachCheck = typeof req.body.MasachCheck == "object";
    check.push(isNumMasachCheck);
    let isNulSoluongCheck = req.body.SoluongCheck == null;
    check.push(!isNulSoluongCheck);
    let isNumSoluongCheck = typeof req.body.SoluongCheck == "object";
    check.push(isNumSoluongCheck);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      let resreturn = true;
      let mess = [];
      for (let i = 0; i < req.body.MasachCheck.length; i++) {
        let data_chek = await sachmodel.findById(req.body.MasachCheck[i]);
        if (data_chek.Soluongton < req.body.SoluongCheck[i]) {
          resreturn = false;
          mess.push(
            "Hiện Sách " +
            data_chek.Tensach +
            " Chỉ Còn: " +
            data_chek.Soluongton +
            "\n"
          );
        }
      }
      if (!resreturn) {
        res.send({ Messager: mess });
      } else {
        var data = new DonDatHangmodel(req.body);
        data.save();
        res.send(data);
      }
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
    let isNullTinhtranggiaohang = req.body.Tinhtranggiaohang == null;
    check.push(!isNullTinhtranggiaohang);
    let isStringTinhtranggiaohang =
      typeof req.body.Tinhtranggiaohang == "boolean";
    check.push(isStringTinhtranggiaohang);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      DonDatHangmodel.findByIdAndUpdate(
        req.body.id,
        {
          Dathanhtoan: req.body.Tinhtranggiaohang,
          Tinhtranggiaohang: req.body.Tinhtranggiaohang,
          Ngaygiao: new Date(),
        },
        (err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.send(data);
          }
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
      var data = await DonDatHangmodel.findByIdAndDelete(req.params.id);
      res.send(data);
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};
