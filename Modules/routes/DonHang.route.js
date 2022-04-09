module.exports = function (app) {
  var controller = require("../controller/DonHang.controller");

  //Get List
  app.get("/DonHang", controller.getAll);

  //Phân Trang
  app.get("/DonHang/:page/:limit", controller.getAllPagination);

  //Phân Trang có count
  app.get("/PhanTrangDonHang/:page/:limit", controller.getAllPaginationHaveCount);

  //Phân Trang By Date
  app.get(
    "/DonHang/:page/:limit/:Ngaydat/:GioiHan/:idKH",
    controller.PhanTrangDonHang
  );

  //Get by id
  app.get("/DonHangbyid/:id", controller.getbyid);

  //Get by idKH
  app.get("/DonHangbyidKH/:idKH", controller.getbyidKH);
  
  //Get by idKH Và Phân Trang
  app.get("/DonHangbyidKH/:idKH/:page/:limit", controller.getbyidKHPhanTrang);

  //Get by idKH Có Date
  app.get("/DonHang/:idKH/:Ngaydat/:GioiHan", controller.getbyidKHDate);

  //Thêm Mới
  app.post("/DonHang", controller.insert);

  //Sửa
  app.put("/DonHang", controller.update);

  //Xóa theo id
  app.delete("/DonHangbyid/:id", controller.deletebyid);
};
