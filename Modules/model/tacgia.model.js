const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    TenTG: {
      type: String,
      required: true,
    },
    Diachi: {
      type: String
    },
    Tieusu: {
      type: String
    },
    Dienthoai: {
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

var tacgiamodel = mongoose.model("tacgia", schema);
module.exports = tacgiamodel;
