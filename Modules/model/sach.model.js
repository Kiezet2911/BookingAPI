const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const schema = mongoose.Schema(
  {
    Tensach: {
      type: String,
      require: true,
    },
    Giaban: {
      type: Number,
      require: true,
    },
    Mota: {
      type: String,
      require: true,
    },
    Anhbia: {
      type: String,
      require: true,
    },
    Soluongton: {
      type: Number,
      require: true,
    },
    MaCD: {
      type: Array,
      require: true,
    },
    MaNXB: {
      type: ObjectId,
      require: true,
    },
    MaTacGia: {
      type: ObjectId,
      require: true,
    },
    soluongban: {
      type: Number,
      require: true,
    },
    //status false là chưa bị xóa true là đã bị xóa
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { versionKey: false }
);

var sachmodel = mongoose.model("sach", schema);

module.exports = sachmodel;
