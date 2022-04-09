module.exports = function (app) {
  var controller = require("../controller/Sendmail.controller");

  //Get List
  app.get("/Sendmail/:Mail", controller.SendMail);

};
