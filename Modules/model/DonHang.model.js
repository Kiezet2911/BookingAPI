const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    Dathanhtoan: {
      type: Boolean,
      default: false,
      required: false,
    },
    Tinhtranggiaohang: {
      type: Boolean,
      required: false,
    },
    Ngaydat: {
      type: Date,
      default: false,
      required: true,
    },
    Ngaygiao: {
      type: Date,
      required: false,
    },
    TongTien: {
      type: Number,
      required: true,
    },
    MaKH: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

var DonDatHangmodel = mongoose.model("DonDatHang", schema);
module.exports = DonDatHangmodel;
