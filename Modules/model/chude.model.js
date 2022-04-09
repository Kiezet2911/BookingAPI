const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    TenChuDe: {
      type: String,
      required: true,
    },
    //status false là chưa bị xóa true là đã bị xóa
    status: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

var chudemodel = mongoose.model("ChuDe", schema);
module.exports = chudemodel;
