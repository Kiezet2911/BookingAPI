//Body-Parser Công Cụ Hỗ Trợ Định Dạng Json Từ Request
const bodyParser = require("body-parser");
var express = require("express");
const MongoClient = require("mongoose");
var app = express();
//Giao Diện Ui Cho Api
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

//Mở Giới Hạn Cho Phép Upload File Có Dung Lượng Lớn
app.use(bodyParser.json({ limit: "50mb", parameterLimit: 1000000 }));

//Set Header Để Không Bị Lỗi Cros khi Up Lên Heroku Và call tới đồ án font-end
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, HEAD, OPTIONS"
  );
  next();
});

app.use((err, req, res, next) => {
  if (err) {
    res.send({ Messager: err.type });
  }
});

//Giao Diện UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Gọi Tới Các route
require("./Modules/routes/chude.route")(app);
require("./Modules/routes/khachhang.route")(app);
require("./Modules/routes/DonHang.route")(app);
require("./Modules/routes/CTDonHang.route")(app);
require("./Modules/routes/nhaxuatban.route")(app);
require("./Modules/routes/sach.route")(app);
require("./Modules/routes/tacgia.route")(app);
require("./Modules/routes/Banner.route")(app);
require("./Modules/routes/UploadImage.route")(app);
require("./Modules/routes/GETCDTGNXB.route")(app);

//Mở cổng server kết nối tới Mongodb
const uri =
  "mongodb+srv://Kizzz:Maimaiyeuem2911@cluster0.m43op.mongodb.net/QLBanSach?retryWrites=true&w=majority";
MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  try {
    //config port để thuận tiện hơn khi đẩy lên heroku
    const host = "0.0.0.0";
    const port = process.env.PORT || 3000;
    app.listen(port, host, function () {});
  } catch (error) {
    console.log(error);
  }
});
