const sendGridMgr = require('./utils/sendGridManager');
const settings = require('./local.settings.json');

console.log('>>', sendGridMgr);

const pdfFileName = "expense-1.pdf";
const localFilePath = `${settings.Blob.LocalReportFolder}${pdfFileName}`;
console.log(`Local folder path: ${localFilePath}`);

const to = 'majuurnalliah@gmail.com';
const subject = 'Expense Report';
const htmlContent = 'This is your copy of the expense report you have just submitted.';

const resp = sendGridMgr.sendEmailWithPdfAttachment(to, subject, htmlContent, localFilePath);

console.log('>>>', resp);

console.log('done');
