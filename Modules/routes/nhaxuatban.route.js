module.exports = function (app) {
  var controller = require("../controller/nhaxuatban.controller");

  //Get List
  app.get("/nhaxuatban", controller.getAll);

  //Get by id
  app.get("/nhaxuatbanbyid/:id", controller.getbyid);

  //Thêm Mới
  app.post("/nhaxuatban", controller.insert);

  //Sửa
  app.put("/nhaxuatban", controller.update);

  //Xóa theo id
  app.delete("/nhaxuatbanbyid/:id", controller.deletebyid);
};
