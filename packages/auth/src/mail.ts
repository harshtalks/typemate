import mailer from "nodemailer";

mailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "hiram.gusikowski82@ethereal.email",
    pass: "H6kmYABTCNTMGjmmvs",
  },
});
