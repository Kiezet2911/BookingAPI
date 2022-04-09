const khachhangmodel = require("../model/khachhang.model");
const CTDonHangModel = require("../model/CTDonHang.model");
const DonHangModel = require("../model/DonHang.model");

const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

//Get By ID
exports.get1 = async (req, res) => {
  try {
    let check = [];
    let isNull = req.params.id == null;
    check.push(!isNull);
    let isString = typeof req.params.id == "string";
    check.push(isString);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = await khachhangmodel.findById(req.params.id);

      if (data == null) {
        res.send({ Messager: "Không Có Khách Hàng Thuộc ID này" });
      } else {
        res.send({
          id: data._id,
          HoTen: data.HoTen,
          Email: data.Email,
          Anh: data.Anh,
          DiachiKH: data.DiachiKH,
          DienthoaiKH: data.DienthoaiKH,
          Ngaysinh: data.Ngaysinh,
          Role: data.Role,
        });
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Get List
exports.getAll = async (req, res) => {
  var data = await khachhangmodel.find();
  res.send(data);
};

//Get List ForAdmin
exports.getAllforadmin = async (req, res) => {
  let data = await khachhangmodel.find(
    { Role: req.params.Role },
    { Taikhoan: 1, HoTen: 1, Email: 1, Role: 1 }
  );

  if (data.length <= 0) {
    res.status(404).send("Not Found");
  } else {
    res.status(200).send(data);
  }
};

//Get Pagination List ForAdmin
exports.getAllforadminPagination = async (req, res) => {
  const page = req.params.page;
  const limit = req.params.limit;
  let count = await khachhangmodel.find({ Role: req.params.Role }).count();
  if (count == 0) {
    res.send({ Messager: "Hiện Không Có Tài Khoản Trong Role Này" });
  } else {
    let data = await khachhangmodel
      .find(
        { Role: req.params.Role },
        { Taikhoan: 1, HoTen: 1, Email: 1, Role: 1 }
      )
      .skip((page - 1) * limit)
      .limit(limit * 1);
    res.status(200).send({ data: data, count: count });
  }
};

//Get By Tài Khoản
exports.gettk = async (req, res) => {
  try {
    let check = [];
    let isNull = req.params.tk == null;
    check.push(!isNull);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      var data = khachhangmodel.find(
        { $text: { $search: req.params.tk } },
        (err, data) => {
          if (err) throw err;
          if (data.length > 0) res.send(data);
          if (data.length <= 0) res.send(null);
        }
      );
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Get By Tài Khoản
exports.setRole = async (req, res) => {
  try {
    let check = [];
    let isNull = req.body.id == null;
    check.push(!isNull);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      req.body.id.forEach(async (data) => {
        await khachhangmodel.findByIdAndUpdate(data, {
          Role: true,
        });
      });

      res.send({ Messager: "Cấp Quyền Thành Công" });
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Đăng Nhập
exports.login = (req, res) => {
  try {
    let check = [];
    let isNullTaikhoan = req.body.Taikhoan == null;
    check.push(!isNullTaikhoan);
    let isStringTaikhoan = typeof req.body.Taikhoan == "string";
    check.push(isStringTaikhoan);
    let isNullMatkhau = req.body.Matkhau == null;
    check.push(!isNullMatkhau);
    let isStringMatkhau = typeof req.body.Matkhau == "string";
    check.push(isStringMatkhau);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      khachhangmodel.find(
        { $text: { $search: req.body.Taikhoan } },
        (err, data) => {
          if (err) {
            throw err;
          } else {
            if (data.length > 0) {
              data.forEach(async (data) => {
                const sosanh = await bcrypt.compare(
                  req.body.Matkhau,
                  data.Matkhau
                );
                if (sosanh) {
                  res.send({
                    Messenger: "Đăng Nhập Thành Công",
                    id: data.id,
                    HoTen: data.HoTen,
                    Email: data.Email,
                    DienthoaiKH: data.DienthoaiKH,
                    Role: data.Role,
                  });
                } else {
                  res.send({
                    data: null,
                    Messenger: "Sai Mật Khẩu Vui Lòng Nhập Lại",
                  });
                }
              });
            } else {
              res.send({ data: null, Messenger: "Đăng Nhập Thất Bại" });
            }
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

//Đăng Ký
exports.insert = (req, res) => {
  try {
    let check = [];
    let isNullHoTen = req.body.HoTen == null;
    check.push(!isNullHoTen);
    let isStringHoTen = typeof req.body.HoTen == "string";
    check.push(isStringHoTen);
    let isNullTaikhoan = req.body.Taikhoan == null;
    check.push(!isNullTaikhoan);
    let isStringTaikhoan = typeof req.body.Taikhoan == "string";
    check.push(isStringTaikhoan);
    let isNullMatkhau = req.body.Matkhau == null;
    check.push(!isNullMatkhau);
    let isStringMatkhau = typeof req.body.Matkhau == "string";
    check.push(isStringMatkhau);
    let isNullConfirmMatKhau = req.body.ConfirmMatKhau == null;
    check.push(!isNullConfirmMatKhau);
    let isStringConfirmMatKhau = typeof req.body.ConfirmMatKhau == "string";
    check.push(isStringConfirmMatKhau);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      if (req.body.Matkhau == req.body.ConfirmMatKhau) {
        //Tìm Xem Có Bị Trùng Tài Khoản Hay Không
        khachhangmodel.find(
          { $text: { $search: req.body.Taikhoan } },
          (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
              data.forEach((data) => {
                res.send({
                  Messenger: "Tài Khoản Bị Trùng",
                  Taikhoan: data.Taikhoan,
                });
              });
            } else {
              var signup = new khachhangmodel(req.body);
              signup.save();
              res.send({
                Messenger: "Đăng Ký Thành Công",
                id: signup._id,
                Taikhoan: signup.Taikhoan,
                HoTen: signup.HoTen,
                Role: signup.Role,
              });
            }
          }
        );
      } else {
        res.send({
          Messenger: "Mật Khẩu Không Trùng Nhau",
        });
      }
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Đăng Ký Admin
exports.createadmin = (req, res) => {
  try {
    let check = [];
    let isNullHoTen = req.body.HoTen == null;
    check.push(!isNullHoTen);
    let isStringHoTen = typeof req.body.HoTen == "string";
    check.push(isStringHoTen);
    let isNullTaikhoan = req.body.Taikhoan == null;
    check.push(!isNullTaikhoan);
    let isStringTaikhoan = typeof req.body.Taikhoan == "string";
    check.push(isStringTaikhoan);
    let isNullMatkhau = req.body.Matkhau == null;
    check.push(!isNullMatkhau);
    let isStringMatkhau = typeof req.body.Matkhau == "string";
    check.push(isStringMatkhau);
    let isNullConfirmMatKhau = req.body.ConfirmMatKhau == null;
    check.push(!isNullConfirmMatKhau);
    let isStringConfirmMatKhau = typeof req.body.ConfirmMatKhau == "string";
    check.push(isStringConfirmMatKhau);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      if (req.body.Matkhau == req.body.ConfirmMatKhau) {
        //Tìm Xem Có Bị Trùng Tài Khoản Hay Không
        khachhangmodel.find(
          { $text: { $search: req.body.Taikhoan } },
          (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
              data.forEach((data) => {
                res.send({
                  Messenger: "Tài Khoản Bị Trùng",
                  Taikhoan: data.Taikhoan,
                });
              });
            } else {
              const obj = {
                HoTen: req.body.HoTen,
                Taikhoan: req.body.Taikhoan,
                Matkhau: req.body.Matkhau,
                Role: true,
              };
              var signup = new khachhangmodel(obj);
              signup.save();
              res.send({
                Messenger: "Đăng Ký Thành Công",
                id: signup._id,
                Taikhoan: signup.Taikhoan,
                HoTen: signup.HoTen,
                Role: signup.Role,
              });
            }
          }
        );
      } else {
        res.send({
          Messenger: "Mật Khẩu Không Trùng Nhau",
        });
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
    let isNullHoTen = req.body.HoTen == null;
    check.push(!isNullHoTen);
    let isStringHoTen = typeof req.body.HoTen == "string";
    check.push(isStringHoTen);
    let isNullEmail = req.body.Email == null;
    check.push(!isNullEmail);
    let isStringEmail = typeof req.body.Email == "string";
    check.push(isStringEmail);
    let isNullDiachiKH = req.body.DiachiKH == null;
    check.push(!isNullDiachiKH);
    let isStringDiachiKH = typeof req.body.DiachiKH == "string";
    check.push(isStringDiachiKH);
    let isNullDienthoaiKH = req.body.DienthoaiKH == null;
    check.push(!isNullDienthoaiKH);
    let isStringDienthoaiKH = typeof req.body.DienthoaiKH == "string";
    check.push(isStringDienthoaiKH);
    let isNullNgaysinh = req.body.Ngaysinh == null;
    check.push(!isNullNgaysinh);
    let isStringNgaysinh = typeof req.body.Ngaysinh == "string";
    check.push(isStringNgaysinh);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      khachhangmodel.findById(req.body.id, (err, data) => {
        if (err) throw err;
        khachhangmodel
          .findByIdAndUpdate(req.body.id, {
            Anh: req.body.Anh,
            HoTen: req.body.HoTen,
            Email: req.body.Email,
            DiachiKH: req.body.DiachiKH,
            DienthoaiKH: req.body.DienthoaiKH,
            Ngaysinh: req.body.Ngaysinh,
          })
          .then((data) => {
            if (err) throw err;
            khachhangmodel.findById(req.body.id, (err, data) => {
              res.send({
                Messenger: "Cập Nhật Thành Công",
                id: data._id,
                Taikhoan: data.Taikhoan,
                Anh: data.Anh,
                HoTen: data.HoTen,
                Email: data.Email,
                DiachiKH: data.DiachiKH,
                DienthoaiKH: data.DienthoaiKH,
                Ngaysinh: data.Ngaysinh,
              });
            });
          });
      });
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Cập Nhật Mật Khẩu
exports.updatemk = async (req, res) => {
  try {
    let check = [];
    let isNullid = req.body.id == null;
    check.push(!isNullid);
    let isStringid = typeof req.body.id == "string";
    check.push(isStringid);
    let isNullMatkhaued = req.body.Matkhaued == null;
    check.push(!isNullMatkhaued);
    let isStringMatkhaued = typeof req.body.Matkhaued == "string";
    check.push(isStringMatkhaued);
    let isNullnewMatkhau = req.body.newMatkhau == null;
    check.push(!isNullnewMatkhau);
    let isStringnewMatkhau = typeof req.body.newMatkhau == "string";
    check.push(isStringnewMatkhau);
    let isNullConfirmMatKhau = req.body.ConfirmMatKhau == null;
    check.push(!isNullConfirmMatKhau);
    let isStringConfirmMatKhau = typeof req.body.ConfirmMatKhau == "string";
    check.push(isStringConfirmMatKhau);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      khachhangmodel.findById(req.body.id, async (err, data) => {
        if (err) throw err;
        const sosanh = await bcrypt.compare(req.body.Matkhaued, data.Matkhau);
        const sosanh2 = await bcrypt.compare(req.body.newMatkhau, data.Matkhau);
        if (sosanh2) {
          res.send({
            Messenger: "Vui Lòng Điền Mật Khẩu Khác Với Mật Khẩu Cũ",
          });
        } else {
          if (sosanh) {
            if (req.body.newMatkhau == req.body.ConfirmMatKhau) {
              const salt = await bcrypt.genSalt(10);
              const passwordHashed = await bcrypt.hash(
                req.body.newMatkhau,
                salt
              );
              khachhangmodel
                .findByIdAndUpdate(req.body.id, {
                  Matkhau: passwordHashed,
                })
                .then((data) => {
                  if (err) throw err;
                  khachhangmodel.findById(req.body.id, (err, data) => {
                    res.send({
                      Messenger: "Cập Nhật Thành Công",
                      id: data._id,
                      Taikhoan: data.Taikhoan,
                    });
                  });
                });
            } else {
              res.send({ Messenger: "Mật Khẩu Không Trùng Nhau" });
            }
          } else {
            res.send({ Messenger: "Mật Khẩu Sai Vui Lòng Nhập Lại" });
          }
        }
      });
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

//Xóa
exports.delete = async (req, res) => {
  try {
    let check = [];
    let isNull = req.params.id == null;
    check.push(!isNull);
    let isString = typeof req.params.id == "string";
    check.push(isString);

    let isTrue = (value) => value === true;
    if (check.every(isTrue)) {
      khachhangmodel.findByIdAndDelete(req.params.id, async (err, data) => {
        if (err) {
          res.send({ Messager: "Lỗi" });
        } else {
          let MaDonHang = await DonHangModel.aggregate([
            { $match: { MaKH: req.params.id } },
            { $project: { _id: 0, id: { $toString: "$_id" } } },
          ]);
          if (MaDonHang.length <= 0) {
            res.send({ Messager: "Khách Hàng Này Chưa Có Đơn Để Xóa" });
          } else {
            await DonHangModel.deleteMany({
              MaKH: req.params.id,
            });
            MaDonHang.forEach(async (data) => {
              await CTDonHangModel.deleteMany({
                MaDonHang: ObjectId(data.id),
              });
            });
            res.send({ Messager: "Xóa Thành Công" });
          }
        }
      });
    } else {
      res.send({ Messager: "ReqBody Lỗi" });
    }
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};
