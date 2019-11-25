const sgMail = require("@sendgrid/mail");
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromEmailAddr = process.env.SENDGRID_FROM_EMAIL

// Private
function sendEmail(context, to, subject, htmlContent) {
  const msg = {
    to: to,
    from: fromEmailAddr,
    subject: subject,
    html: htmlContent
  }
  // send email
  sgMail.send(msg, function(err, json) {
    if (err) {
        context.log(err);
        return err;
      }
    context.log(json);
    return json;
  });
}

// function convertToBase64(filePath) {
//   // To add attachment, we need to read the file/string 64 bit string
//   let buff = fs.readFileSync(filePath);
//   let base64data = buff.toString('base64');
//   return base64data;
// }

function sendEmailWithPdfAttachment(context, to, subject, htmlContent, dataString, fileName) {
  // Convert string to base64 for attachment
  // const base64data = convertToBase64(dataString);
  let buff = Buffer.from(dataString);
  let base64data = buff.toString('base64');

  const msg = {
    to: to,
    from: fromEmailAddr,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        content: base64data,
        filename: fileName,
        type: 'application/pdf',
        disposition: 'attachment',
        conentId: 'text'
      },
    ],
  };

  // send email
  sgMail.send(msg, function(err, json) {
    if (err) { return console.log(err); }
    console.log(json);
  });
}

module.exports = {
  sendEmail: sendEmail,
  sendEmailWithPdfAttachment: sendEmailWithPdfAttachment
}
