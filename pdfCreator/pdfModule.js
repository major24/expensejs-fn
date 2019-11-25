const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateHeader = (doc) => {
  const topPosToStart = 50;
  doc
  .fillColor("#0000FF")
  .fontSize(16)
  .text("Expense Report", 50, topPosToStart)
  .fontSize(10)
  .moveDown();

  // Draw a line under title
  doc.moveTo(50, 68)                       // set the current point
    .lineTo(540, 68)                        // draw line
    .stroke();
}

const generateUserInformation = (doc, user, expense) => {
  const topPosToStart = 80;
  doc
    .fillColor("#0080FF")
    .text(`Expense Report Id:`, 50, topPosToStart)
    .text(`Submitted Date:`, 50, topPosToStart + 15)
    .text(`Submitted By:`, 50, topPosToStart + 30)
    .fillColor("#088A08")
    .text(`${expense.id}`, 150, topPosToStart)
    .text(`${expense.submittedDate}`, 150, topPosToStart + 15)
    .text(`${user.firstName} ${user.lastName}`, 150, topPosToStart + 30)
    .moveDown();

  // Draw a line under title
  doc.moveTo(50, 130)                       // set the current point
    .lineTo(540, 130)                        // draw line
    .stroke();
}

const createRowHeader = (doc, y, headers) => {
  doc
    .fontSize(8)
    .fillColor("blue")
    .text(headers[0], 50, y)
    .text(headers[1], 100, y)
    .text(headers[2], 150, y)
    .text(headers[3], 350, y)
    .text(headers[4], 450, y, { width: 40, align: "right" })
    .text(headers[5], 500, y, { width: 40, align: "right" });
};

const createRowDetail = (doc, y, rowData) => {
  doc
    .fontSize(8)
    .fillColor("black")
    .text(rowData.id, 50, y)
    .text(rowData.transType, 100, y)
    .text(rowData.description.substring(0, 45), 150, y)
    .text(rowData.category, 350, y)
    .text(rowData.amount.toFixed(2), 450, y, { width: 40, align: "right" })
    .text(rowData.tax.toFixed(2), 500, y, { width: 40, align: "right" });
};

const createTable = (doc, expItems, topPos, headers = []) => {
  // start y pos
  let y = topPos;
  // if headers found, create header row..
  if (headers.length !== 0) {
    createRowHeader(doc, y, headers);
    y = y + 20;
  }

  expItems.map(item => {
    createRowDetail(doc, y, item);
    y = y + 15;
  });
};

function create(data) {
  return new Promise(function(resolve, reject) {
    if (!data) {
      reject('Data not found');
    }

    const headers = ['TransId', 'TransType', 'Description', 'Category', 'Amount', 'Tax'];
    const expenseId = data.expense.id;
    let timestamp = Date.now();
    const outputFile = `expense-${expenseId}-${timestamp}.pdf`;

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(`./reports/${outputFile}`));
    const topPosToStart = 150;

    generateHeader(doc);
    generateUserInformation(doc, data.user, data.expense);
    createTable(doc, data.expenseItems, topPosToStart, headers);

    doc.end();
    // resolve the promise
    resolve(outputFile);
  });
}

module.exports = {
  create: create
}
