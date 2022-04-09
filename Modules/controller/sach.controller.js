const { ObjectId } = require("mongodb");
const sachmodel = require("../model/sach.model");
const Bannermodel = require("../model/Banner.model");
//Get List
exports.getAll = async (req, res) => {
  var data = await sachmodel
    .aggregate([
      { $match: { status: false } },
      {
        $lookup: {
          from: "tacgias",
          localField: "MaTacGia",
          foreignField: "_id",
          as: "tac",
        },
      },
      {
        $unwind: "$tac",
      },
      {
        $unwind: "$MaCD",
      },
      { $addFields: { MaCD: { $toObjectId: "$MaCD" } } },
      {
        $lookup: {
          from: "chudes",
          localField: "MaCD",
          foreignField: "_id",
          as: "chude",
        },
      },
      {
        $project: {
          id: "$_id",
          Tensach: "$Tensach",
          Anh: "$Anhbia",
          Soluongton: "$Soluongton",
          TacGia: "$tac.TenTG",
          Giaban: "$Giaban",
          TenChuDe: "$chude.TenChuDe",
        },
      },
      {
        $unwind: "$TenChuDe",
      },
      {
        $group: {
          _id: "$_id",
          id: { $first: "$_id" },
          Tensach: { $first: "$Tensach" },
          Anh: { $first: "$Anh" },
          Soluongton: { $first: "$Soluongton" },
          TacGia: { $first: "$TacGia" },
          Giaban: { $first: "$Giaban" },
          ChuDe: { $push: "$TenChuDe" },
        },
      },
    ])
    .sort({ Giaban: 1 });
  res.send(data);
};

//Get by Chủ Đề
exports.getbyidCD = async (req, res) => {
  let check = [];
  let isNullidCD = req.params.idCD == null;
  check.push(!isNullidCD);
  let isStringidCD = typeof req.params.idCD == "string";
  check.push(isStringidCD);

  let isTrue = (value) => value === true;
  if (check.every(isTrue)) {
    const data = await sachmodel
      .aggregate([
        { $match: { MaCD: req.params.idCD, status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $unwind: "$tac",
        },
      ])
      .sort({ Giaban: 1 });
    if (data.length <= 0) {
      res.send([{ Messager: "Không Có Sách Trong Chủ Đề Này" }]);
    } else {
      const Array = [];
      data.forEach((data) => {
        const obj = {
          id: data._id,
          Tensach: data.Tensach,
          TenTG: data.tac.TenTG,
          Soluongton: data.Soluongton,
          Anh: data.Anhbia,
          Giaban: data.Giaban,
        };
        Array.push(obj);
      });
      res.send(Array);
    }
  } else {
    res.send({ Messager: "ReqBody Lỗi" });
  }
};

//Get Pagination
exports.getpagination = async (req, res) => {
  try {
    const page = req.params.page;
    const limit = req.params.limit;
    const data = await sachmodel
      .aggregate([
        { $match: { status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $lookup: {
            from: "nhaxuatbans",
            localField: "MaNXB",
            foreignField: "_id",
            as: "nxb",
          },
        },
        {
          $unwind: "$tac",
        },
        {
          $unwind: "$nxb",
        },
      ])
      .sort({ Giaban: 1 })
      .skip((page - 1) * limit)
      .limit(limit * 1);

    if (data.length <= 0) {
      res.send([{ Messager: "Không Có Sách Này" }]);
    } else {
      const Array = [];
      data.forEach((data) => {
        const obj = {
          id: data._id,
          Tensach: data.Tensach,
          TenTG: data.tac.TenTG,
          Soluongton: data.Soluongton,
          TenNXB: data.nxb.TenNXB,
          Anh: data.Anhbia,
          Giaban: data.Giaban,
          Mota: data.Mota,
        };
        Array.push(obj);
      });
      res.send(Array);
    }
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get Pagination By Chủ Đề
exports.getpaginationbychude = async (req, res) => {
  try {
    const page = req.params.page;
    const limit = req.params.limit;
    const data = await sachmodel
      .aggregate([
        { $match: { MaCD: req.params.id, status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $lookup: {
            from: "nhaxuatbans",
            localField: "MaNXB",
            foreignField: "_id",
            as: "nxb",
          },
        },
        {
          $unwind: "$tac",
        },
        {
          $unwind: "$nxb",
        },
      ])
      .sort({ Giaban: 1 })
      .skip((page - 1) * limit)
      .limit(limit * 1);

    if (data.length <= 0) {
      res.send([{ Messager: "Không Có Sách Này" }]);
    } else {
      const Array = [];
      data.forEach((data) => {
        const obj = {
          id: data._id,
          Tensach: data.Tensach,
          TenTG: data.tac.TenTG,
          Soluongton: data.Soluongton,
          TenNXB: data.nxb.TenNXB,
          Anh: data.Anhbia,
          Giaban: data.Giaban,
          Mota: data.Mota,
        };
        Array.push(obj);
      });
      res.send(Array);
    }
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get Pagination By Name
exports.getpaginationSearch = async (req, res) => {
  try {
    let check = [];
    let isNull_textsearch = req.body.keyword == null;
    check.push(!isNull_textsearch);
    let isNone_textsearch = req.body.keyword == "";
    check.push(!isNone_textsearch);
    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      const page = req.body.page;
      const limit = req.body.limit;
      const data = await sachmodel
        .aggregate([
          {
            $match: {
              $text: { $search: `\"${req.body.keyword}\"` },
              status: false,
            },
          },
          {
            $lookup: {
              from: "tacgias",
              localField: "MaTacGia",
              foreignField: "_id",
              as: "tac",
            },
          },
          {
            $lookup: {
              from: "nhaxuatbans",
              localField: "MaNXB",
              foreignField: "_id",
              as: "nxb",
            },
          },
          {
            $unwind: "$tac",
          },
          {
            $unwind: "$nxb",
          },
        ])
        .sort({ Giaban: 1 })
        .skip((page - 1) * limit)
        .limit(limit * 1);
      if (data.length <= 0) {
        res.send([{ Messager: "Không Có Sách Này" }]);
      } else {
        const Array = [];
        data.forEach((data) => {
          const obj = {
            id: data._id,
            Tensach: data.Tensach,
            TenTG: data.tac.TenTG,
            Soluongton: data.Soluongton,
            TenNXB: data.nxb.TenNXB,
            Anh: data.Anhbia,
            Giaban: data.Giaban,
            Mota: data.Mota,
          };
          Array.push(obj);
        });
        res.send(Array);
      }
    } else {
      res.status(400).send("Text Search Null");
    }
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get 3 sách mới thêm vào
exports.gettimestamps = async (req, res) => {
  try {
    const data = await sachmodel
      .aggregate([
        { $match: { status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $unwind: "$tac",
        },
      ])
      .sort({ createdAt: -1 })
      .limit(3);

    var db;
    var Array = [];
    data.forEach((obj, index) => {
      db = {
        id: obj._id,
        Tensach: obj.Tensach,
        Anh: obj.Anhbia,
        TenTG: obj.tac.TenTG,
        Mota: obj.Mota,
      };
      Array.push(db);
    });
    res.send(Array);
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get Bán Chạy
exports.getbanchayfirst = async (req, res) => {
  try {
    const data = await sachmodel
      .aggregate([
        { $match: { status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $unwind: "$tac",
        },
      ])
      .sort({ soluongban: -1 })
      .limit(4);
    var db;
    var Array = [];
    data.forEach((obj, index) => {
      db = {
        id: obj._id,
        Tensach: obj.Tensach,
        Anh: obj.Anhbia,
        Soluongton: obj.Soluongton,
        TenTG: obj.tac.TenTG,
        DaBan: obj.soluongban,
      };
      Array.push(db);
    });
    res.send(Array);
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get 4 sách bán chạy sau
exports.getbanchaysecond = async (req, res) => {
  try {
    var data = await sachmodel
      .aggregate([
        { $match: { status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $unwind: "$tac",
        },
      ])
      .sort({ soluongban: -1 })
      .skip(4)
      .limit(4);
    var db;
    var Array = [];
    data.forEach((obj, index) => {
      db = {
        id: obj._id,
        Tensach: obj.Tensach,
        Anh: obj.Anhbia,
        Soluongton: obj.Soluongton,
        TenTG: obj.tac.TenTG,
        DaBan: obj.soluongban,
      };
      Array.push(db);
    });
    res.send(Array);
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
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
      var data = await sachmodel.aggregate([
        { $match: { _id: ObjectId(req.params.id), status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $lookup: {
            from: "nhaxuatbans",
            localField: "MaNXB",
            foreignField: "_id",
            as: "nxb",
          },
        },
        {
          $unwind: "$tac",
        },
        {
          $unwind: "$nxb",
        },
        {
          $unwind: "$MaCD",
        },
        { $addFields: { MaCD: { $toObjectId: "$MaCD" } } },
        {
          $lookup: {
            from: "chudes",
            localField: "MaCD",
            foreignField: "_id",
            as: "chude",
          },
        },
        {
          $project: {
            id: "$_id",
            Tensach: "$Tensach",
            Anh: "$Anhbia",
            Soluongton: "$Soluongton",
            Mota: "$Mota",
            TenTG: "$tac.TenTG",
            TenNXB: "$nxb.TenNXB",
            Giaban: "$Giaban",
            TenChuDe: "$chude.TenChuDe",
            MaCD: "$chude._id",
          },
        },
        {
          $unwind: "$TenChuDe",
        },
        {
          $unwind: "$MaCD",
        },
        {
          $group: {
            _id: "$_id",
            id: { $first: "$_id" },
            Tensach: { $first: "$Tensach" },
            Anh: { $first: "$Anh" },
            Mota: { $first: "$Mota" },
            Soluongton: { $first: "$Soluongton" },
            TenTG: { $first: "$TenTG" },
            TenNXB: { $first: "$TenNXB" },
            Giaban: { $first: "$Giaban" },
            ChuDe: { $push: "$TenChuDe" },
            MaCD: { $push: "$MaCD" }
          },
        }
      ]);
      if (data.length <= 0) {
        res.send([{ Messager: "Không Có Sách Này" }]);
      } else {
        let MaCD
        data.forEach(result => {
          MaCD = result.MaCD[0].toString();
        })
        const Array = []
        const BookLienQuan = await sachmodel.find({ MaCD: MaCD, status: false }, { _id: 1, Tensach: 1, Anhbia: 1, Giaban: 1 })
        BookLienQuan.forEach(dt => {
          if (!(dt._id.toString() === req.params.id)) {
            Array.push(dt)
          }
        });
        res.send({ data: data, BookLienQuan: Array });
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" + error }]);
  }
};

//Get by name
exports.getbyname = async (req, res) => {
  try {
    let check = [];
    let isNullname = req.body.name == null;
    check.push(!isNullname);
    let isStringname = typeof req.body.name == "string";
    check.push(isStringname);
    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      const data = await sachmodel
        .aggregate([
          {
            $match: {
              $text: { $search: `\"${req.body.name}\"` },
              status: false,
            },
          },
          {
            $lookup: {
              from: "tacgias",
              localField: "MaTacGia",
              foreignField: "_id",
              as: "tac",
            },
          },
          {
            $unwind: "$tac",
          },
        ])
        .sort({ Giaban: 1 });
      if (data.length <= 0) {
        res.send([{ Messager: "Không Có Sách Trong Chủ Đề Này" }]);
      } else {
        const Array = [];
        data.forEach((data) => {
          const obj = {
            id: data._id,
            Tensach: data.Tensach,
            Soluongton: data.Soluongton,
            TenTG: data.tac.TenTG,
            Anh: data.Anhbia,
            Giaban: data.Giaban,
          };
          Array.push(obj);
        });
        res.send(Array);
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Thêm Mới
exports.insert = async (req, res) => {
  try {
    let check = [];
    let isNullTensach = req.body.Tensach == null;
    check.push(!isNullTensach);
    let isStringTensach = typeof req.body.Tensach == "string";
    check.push(isStringTensach);
    let isNullGiaban = req.body.Giaban == null;
    check.push(!isNullGiaban);
    let isStringGiaban = typeof req.body.Giaban == "number";
    check.push(isStringGiaban);
    let isNullMota = req.body.Mota == null;
    check.push(!isNullMota);
    let isStringMota = typeof req.body.Mota == "string";
    check.push(isStringMota);
    let isNullAnhbia = req.body.Anhbia == null;
    check.push(!isNullAnhbia);
    let isStringAnhbia = typeof req.body.Anhbia == "string";
    check.push(isStringAnhbia);
    let isNullSoluongton = req.body.Soluongton == null;
    check.push(!isNullSoluongton);
    let isStringSoluongton = typeof req.body.Soluongton == "number";
    check.push(isStringSoluongton);
    let isNullMaCD = req.body.MaCD == null;
    check.push(!isNullMaCD);
    let isStringMaCD = typeof req.body.MaCD == "object";
    check.push(isStringMaCD);
    let isNullMaNXB = req.body.MaNXB == null;
    check.push(!isNullMaNXB);
    let isStringMaNXB = typeof req.body.MaNXB == "string";
    check.push(isStringMaNXB);
    let isNullMaTacGia = req.body.MaTacGia == null;
    check.push(!isNullMaTacGia);
    let isStringMaTacGia = typeof req.body.MaTacGia == "string";
    check.push(isStringMaTacGia);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = new sachmodel(req.body);
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
    let isNumSoluongton = typeof req.body.Soluongton == "number";
    check.push(isNumSoluongton);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var sach = await sachmodel.findById(req.body.id);
      const slton = sach.Soluongton + req.body.Soluongton;
      sachmodel.findByIdAndUpdate(
        req.body.id,
        {
          Tensach: req.body.Tensach,
          Giaban: req.body.Giaban,
          Mota: req.body.Mota,
          Anhbia: req.body.Anhbia,
          Soluongton: slton,
          MaCD: req.body.MaCD,
          MaNXB: req.body.MaNXB,
          MaTacGia: req.body.MaTacGia,
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
      var data = await sachmodel.findByIdAndUpdate(req.params.id, {
        status: true,
      });
      res.send(data);
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Page Home
exports.home = async (req, res) => {
  try {
    //Get 3 Sách Được Chỉnh Sửa Gần Nhất
    const datatimestamps = await sachmodel
      .aggregate([
        { $match: { status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $unwind: "$tac",
        },
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            _id: 0,
            id: "$_id",
            Tensach: 1,
            Anh: "$Anhbia",
            TenTG: "$tac.TenTG",
            Mota: 1,
          },
        },
      ])
      .limit(3);
    //Get 4 Sách Có Số Lượng Bán Lớn Nhất
    const databanchay = await sachmodel
      .aggregate([
        { $match: { status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $unwind: "$tac",
        },
        { $sort: { soluongban: -1 } },
        {
          $project: {
            _id: 0,
            id: "$_id",
            Tensach: 1,
            Anh: "$Anhbia",
            TenTG: "$tac.TenTG",
          },
        },
      ])
      .limit(4);
    //Get 4 Sách Có Số Lượng Bán Lớn Tiếp Thoe
    const databanchay2 = await sachmodel
      .aggregate([
        { $match: { status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $unwind: "$tac",
        },
        { $sort: { soluongban: -1 } },
        { $skip: 4 },
        {
          $project: {
            _id: 0,
            id: "$_id",
            Tensach: 1,
            Anh: "$Anhbia",
            TenTG: "$tac.TenTG",
          },
        },
      ])
      .limit(4);
    var Banner = await Bannermodel.findById("622f37caf3f4339337026992");
    res.send({
      Book1: databanchay,
      Book2: databanchay2,
      Book3: datatimestamps,
      Banner: Banner,
    });
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get Pagination Tổng Hợp
exports.PhanTrang = async (req, res) => {
  try {
    const page = req.params.page;
    const limit = req.params.limit;
    const count = await sachmodel.find({ status: false }).count();
    if (count == 0) {
      res.send({ Messager: "Không Có Sách Này" });
    } else {
      const data = await sachmodel.aggregate([
        { $match: { status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $lookup: {
            from: "nhaxuatbans",
            localField: "MaNXB",
            foreignField: "_id",
            as: "nxb",
          },
        },
        {
          $unwind: "$tac",
        },
        {
          $unwind: "$nxb",
        },
        { $sort: { Giaban: 1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit * 1 },
        {
          $project: {
            _id: 0,
            id: "$_id",
            Tensach: 1,
            TenTG: "$tac.TenTG",
            Soluongton: 1,
            TenNXB: "$nxb.TenNXB",
            Anh: "$Anhbia",
            Giaban: 1,
            Mota: 1,
          },
        },
      ]);
      res.send({ data: data, count: count });
    }
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get Pagination By Chủ Đề
exports.PhanTrangChuDe = async (req, res) => {
  try {
    const page = req.params.page;
    const limit = req.params.limit;
    const count = await sachmodel
      .find({ MaCD: req.params.id, status: false })
      .count();
    if (count == 0) {
      res.send({ Messager: "Không Có Sách Này" });
    } else {
      const data = await sachmodel.aggregate([
        { $match: { MaCD: req.params.id, status: false } },
        {
          $lookup: {
            from: "tacgias",
            localField: "MaTacGia",
            foreignField: "_id",
            as: "tac",
          },
        },
        {
          $lookup: {
            from: "nhaxuatbans",
            localField: "MaNXB",
            foreignField: "_id",
            as: "nxb",
          },
        },
        { $sort: { Giaban: 1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit * 1 },
        {
          $unwind: "$tac",
        },
        {
          $unwind: "$nxb",
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            Tensach: 1,
            TenTG: "$tac.TenTG",
            Soluongton: 1,
            TenNXB: "$nxb.TenNXB",
            Anh: "$Anhbia",
            Giaban: 1,
            Mota: 1,
          },
        },
      ]);
      res.send({ data: data, count: count });
    }
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get Pagination By Name
exports.PhanTrangSearch = async (req, res) => {
  try {
    let check = [];
    let isNull_textsearch = req.body.keyword == null;
    check.push(!isNull_textsearch);
    let isNone_textsearch = req.body.keyword == "";
    check.push(!isNone_textsearch);
    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      const page = req.body.page;
      const limit = req.body.limit;
      const count = await sachmodel
        .find({ $text: { $search: `\"${req.body.keyword}\"` }, status: false })
        .count();
      if (count == 0) {
        res.send({ Messager: "Không Có Sách Này" });
      } else {
        const data = await sachmodel.aggregate([
          {
            $match: {
              $text: { $search: `\"${req.body.keyword}\"` },
              status: false,
            },
          },
          {
            $lookup: {
              from: "tacgias",
              localField: "MaTacGia",
              foreignField: "_id",
              as: "tac",
            },
          },
          {
            $lookup: {
              from: "nhaxuatbans",
              localField: "MaNXB",
              foreignField: "_id",
              as: "nxb",
            },
          },
          { $sort: { Giaban: 1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit * 1 },
          {
            $unwind: "$tac",
          },
          {
            $unwind: "$nxb",
          },
          {
            $project: {
              _id: 0,
              id: "$_id",
              Tensach: 1,
              TenTG: "$tac.TenTG",
              Soluongton: 1,
              TenNXB: "$nxb.TenNXB",
              Anh: "$Anhbia",
              Giaban: 1,
              Mota: 1,
            },
          },
        ]);
        res.send({ data: data, count: count });
      }
    } else {
      res.send("Text Search Null");
    }
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};

//Get deleted
exports.deleted = async (req, res) => {
  try {
    const data = await sachmodel.find(
      { status: true },
      { _id: 1, Tensach: 1, Anhbia: 1, soluongban: 1 }
    );
    res.send(data);
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};
