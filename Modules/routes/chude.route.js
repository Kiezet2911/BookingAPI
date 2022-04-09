module.exports = function (app) {
  var controller = require("../controller/chude.controller");

  //Get List
  app.get("/chude", controller.getAll);

  //Get by id
  app.get("/chudebyid/:id", controller.getbyid);

  //Get by name
  app.get("/chudebyname/:name", controller.getbyname);

  //Thêm Mới
  app.post("/chude", controller.insert);

  //Sửa
  app.put("/chude", controller.update);

  //Xóa theo id
  app.delete("/chudebyid/:id", controller.deletebyid);

};
