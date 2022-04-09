module.exports = function (app) {
  var controller = require("../controller/Banner.controller");

  //Get List
  app.get("/Banner", controller.getAll);

  //Sửa
  app.put("/Banner", controller.update);

  //Sửa 1 Ảnh
  app.put("/Banner1/:NameAnh", controller.update1IMAGE);

};
