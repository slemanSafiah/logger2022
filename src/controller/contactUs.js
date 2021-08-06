
const nodemailer = require("nodemailer");

exports.contactUs = (req, res) => {
    console.log(req.body)
    const output = `
          <p>You have a new contact request</p>
          <p>Name : ${req.body.Name}</p>
          <p>Email : ${req.body.Email}</p>
          <p>Phone Number : ${req.body.Number}</p>
          <p>Message : ${req.body.Message}</p>
      `;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        tls: true,
        auth: {
            user: "CVBuilder2021@gmail.com",
            pass: "123@123@",
        },
    });

    let mailOptions = {
        from: ` ${req.body.Email}`, // sender address
        to: "CVBuilder2021@gmail.com", // list of receivers
        subject: "E-mail message", // Subject line
        text: `Hello it is ${req.body.Name}`, // plain text body
        html: output, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        return res.status(200).json({
            status: 1,
            msg: "Email has been sent"
        });
    });
}