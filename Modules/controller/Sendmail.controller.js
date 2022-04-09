const fs = require("fs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
  "198105754866-dihbpi97n5n7tnje2j5ohku0638ch6qk.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04Kclt_jr6BylCgYIARAAGAQSNwF-L9IrWRNIGRdK5_azF_sGQPEtdKjwXPFMphh8v1rc6y2_h6SPDFHlm-Kw4i6vd2BGy-wqPys";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.SendMail = async (req, res) => {
  const access_token = await oAuth2Client.getAccessToken();

  const confidMail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "nguyenkiezet@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: access_token,
    },
  });

  var htmlstream = fs.createReadStream("Mail/mail.html");
  let option = {
    from: '"MBook Shop 👻" <Mbook96@hotmail.com>',
    to: req.params.Mail,
    subject: "Mail Từ MBook Shop ✔",
    text: "Thư Cảm Ơn",
    html: htmlstream,
  };

  confidMail.sendMail(option, (err, info) => {
    if (err) {
      res.send({ Messager: err });
    } else {
      res.send({ Messager: info });
    }
  });
};
