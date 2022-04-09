module.exports = function (app) {
  var controller = require("../controller/khachhang.controller");

  //Get By ID
  app.get("/khachhangbyid/:id", controller.get1);

  //Get List
  app.get("/khachhang", controller.getAll);

  //Get Khách Hàng for admin
  app.get("/khachhangforadmin/:Role", controller.getAllforadmin);

  //Get Khách Hàng for admin
  app.get(
    "/khachhangforadmin/:Role/:page/:limit",
    controller.getAllforadminPagination
  );

  //Get By Tài Khoản
  app.get("/tkkhachhang/:tk", controller.gettk);

  //Get Set Quyền Admin
  app.put("/setRole", controller.setRole);

  //Đăng Ký
  app.post("/khachhang", controller.insert);

  //Tạo Tài Khoản Admin
  app.post("/createadmin", controller.createadmin);

  //Đăng Nhập
  app.post("/login", controller.login);

  //Sửa
  app.put("/khachhang", controller.update);

  //cập nhật MK
  app.put("/khachhangmk", controller.updatemk);

  //Xóa
  app.delete("/khachhangbyid/:id", controller.delete);
};
