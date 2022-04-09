const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    TenNXB: {
      type: String,
      required: true,
    },
    Diachi: {
      type: String,
    },
    DienThoai: {
      type: String
    },
    //status false là chưa bị xóa true là đã bị xóa
    status: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

var nhaxuatbanmodel = mongoose.model("nhaxuatban", schema);
module.exports = nhaxuatbanmodel;
