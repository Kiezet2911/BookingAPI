const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = mongoose.Schema(
  {
    Anh: {
      type: String,
      require: true,
      default:
        "https://firebasestorage.googleapis.com/v0/b/chat-1e086.appspot.com/o/default.jpg?alt=media&token=b2f7e2de-5a7e-4bd6-8c29-443015246589",
    },
    HoTen: {
      type: String,
      require: true,
    },
    Taikhoan: {
      type: String,
      require: true,
    },
    Matkhau: {
      type: String,
      require: true,
    },
    Email: {
      type: String,
      require: true,
    },
    DiachiKH: {
      type: String,
      require: true,
    },
    DienthoaiKH: {
      type: String,
      require: true,
    },
    Ngaysinh: {
      type: String,
      require: true,
    },
    imgurl: {
      type: String     
    },
    Role: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { versionKey: false }
);

//trước khi lưu thì lấy pass ra để mã hóa
schema.pre("save", async function (next) {
  try {
    //Tạo ra 1 đoạn random salt kết hợp với mật khẩu để mã hóa
    const salt = await bcrypt.genSalt(10);

    //Tạo 1 password đã được hash(salt + hash)
    const passwordHashed = await bcrypt.hash(this.Matkhau, salt);

    //Tái Chỉ Định lại pass đã được hash(chỉ định lại Mật khẩu là pass đã được mã hóa )
    this.Matkhau = passwordHashed;

    next();
  } catch (error) {
    next(error);
  }
});

var khachhangmodel = mongoose.model("KhachHang", schema);

module.exports = khachhangmodel;
