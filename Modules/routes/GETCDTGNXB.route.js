module.exports = function (app) {
  var controller = require("../controller/GetCDTGNXB.controller");

  //Get List
  app.get("/GETALL", controller.GETALL);
};
