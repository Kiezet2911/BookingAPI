const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    Anh1: {
      type: String,
      required: true,
    },
    Anh2: {
      type: String,
      required: true,
    },
    Anh3: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

var Bannermodel = mongoose.model("Banner", schema);
module.exports = Bannermodel;
