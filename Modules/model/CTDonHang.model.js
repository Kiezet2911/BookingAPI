const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    MaDonHang: {
      type: ObjectId,
      required: true,
    },
    Masach: {
      type: ObjectId,
      required: true,
    },
    Soluong: {
      type: Number,
      required: true,
    },
    Dongia: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

var CTDonDatHangmodel = mongoose.model("CTDonDatHang", schema);
module.exports = CTDonDatHangmodel;
