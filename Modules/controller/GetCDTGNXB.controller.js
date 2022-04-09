const chudemodel = require("../model/chude.model");
const nhaxuatban = require("../model/nhaxuatban.model");
const tacgiamodel = require("../model/tacgia.model");

exports.GETALL = async (req, res) => {
  try {
    const tacgia = await tacgiamodel.find({ status: false });
    const NXB = await nhaxuatban.find({ status: false });
    const chude = await chudemodel.find({ status: false });
    res.send({ tacgia: tacgia, NXB: NXB, chude: chude });
  } catch (error) {
    res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};
