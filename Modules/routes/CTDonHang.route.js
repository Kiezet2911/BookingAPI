module.exports = function (app) {
  var controller = require("../controller/CTDonHang.controller");

  //Get List
  app.get("/CTDonHang", controller.getAll);

  //Get by id
  app.get("/CTDonHangbyid/:id", controller.getbyid);

  //Thêm Mới
  app.post("/CTDonHang", controller.insert);

  //Sửa
  app.put("/CTDonHang", controller.update);

  //Xóa theo id
  app.delete("/CTDonHangbyid/:id", controller.deletebyid);
};
