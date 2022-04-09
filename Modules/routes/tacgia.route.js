module.exports = function (app) {
  var controller = require("../controller/tacgia.controller");

  //Get List
  app.get("/tacgia", controller.getAll);

  //Get by id
  app.get("/tacgiabyid/:id", controller.getbyid);

  //Thêm Mới
  app.post("/tacgia", controller.insert);

  //Sửa
  app.put("/tacgia", controller.update);

  //Xóa theo id
  app.delete("/tacgiabyid/:id", controller.deletebyid);
};
