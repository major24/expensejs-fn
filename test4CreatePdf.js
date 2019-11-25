const pdfModule = require('./pdfCreator/pdfModule');
const data = {
  "expense":
    {"id":1,"userId":"user1","costCentre":"IT1000","approverId":"user4","status":"Submitted","submittedDate":"2019-11-10T00:00:00","updatedDate":"0001-01-01T00:00:00","expenseItems":null},
    "user":
    {"userId":"user1","firstName":"Major","lastName":"Nalliah","managerId":null,"costCentre":null,"active":null,"updatedDate":"0001-01-01T00:00:00"},
    "expenseItems":
    [{"id":1,"expenseId":1, "transType": "DR", "description":"Sheraton Hotel","amount":1450.99,"tax":325.78,"category":"Travel","transDate":"2019-11-10T00:00:00"},{"id":2,"expenseId":1,"transType": "OOP","description":"Taxi Beck","amount":80.50,"tax":18.70,"category":"Travel","transDate":"2019-11-10T00:00:00"}]
  };

console.log('>>', pdfModule);

pdfModule.create(data).then(res => {
  console.log('>>>>RefFile: ', res);
}).catch(err => {
  console.log(err);
});

console.log('done..');
