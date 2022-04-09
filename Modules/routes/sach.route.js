module.exports = function (app) {
  var controller = require("../controller/sach.controller");

  //Get List
  app.get("/sach", controller.getAll);

  //Get by id
  app.get("/sachbyid/:id", controller.getbyid);

  //Get by Chủ Đề
  app.get("/sachbyCD/:idCD", controller.getbyidCD);
 
  //Get sachtimestamps
  app.get("/sachtimestamps", controller.gettimestamps);

  //Get Pagination
  app.get("/sachpagination/:page/:limit", controller.getpagination);

  //Get Pagination Theo Chủ Đề
  app.get(
    "/sachpaginationbychude/:id/:page/:limit",
    controller.getpaginationbychude
  );

  //Get Pagination Search
  app.post("/sachpaginationSearch", controller.getpaginationSearch);

  //Get by Name
  app.post("/sachbyname", controller.getbyname);

  //Get 4 sách bán chạy đầu
  app.get("/sachbanchayfirst", controller.getbanchayfirst);

  //Get 4 sách bán chạy sau
  app.get("/sachbanchaysecond", controller.getbanchaysecond);

  //Thêm Mới
  app.post("/sach", controller.insert);

  //Sửa
  app.put("/sach", controller.update);

  //Xóa theo id
  app.delete("/sachbyid/:id", controller.deletebyid);

  //Get Danh Sách Book Cho Trang Home
  app.get("/home", controller.home);

  //Get Phân Trang Có Tổng
  app.get("/PhanTrang/:page/:limit", controller.PhanTrang);

  //Get Phân Trang Có Tổng
  app.get("/PhanTrangChuDe/:id/:page/:limit", controller.PhanTrangChuDe);

  //Get Phân Trang Theo Tên Sách Có Tổng
  app.post("/PhanTrangSearch", controller.PhanTrangSearch);

  //Những Cuốn Sách Đã Xóa
  app.get("/getdeleted", controller.deleted);
};
