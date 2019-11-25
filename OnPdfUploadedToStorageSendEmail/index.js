var util = require('util');
const settings = require('../local.settings.json');
const azBlobMgr = require('../utils/azureBlobManager');
const fs = require('fs');
const axios = require('axios');

// The 'From' and 'To' fields are automatically populated with the values specified by the binding settings.
//
// You can also optionally configure the default From/To addresses globally via host.config, e.g.:
//
// {
//   "sendGrid": {
//      "to": "user@host.com",
//      "from": "Azure Functions <samples@functions.com>"
//   }
// }
module.exports = async function (context, queueData) {
    if (!queueData.expenseId || !queueData.userId || !queueData.fileName) {
      context.log('User id, Expense id and fileName are required');
      return
    };
    const expenseId = queueData.expenseId;
    context.log('JS triggered by onPdfCreatedInLocalFolderUploadedToStorage ', expenseId);
    const usersApiUrl = settings.Api.Users+'/'+queueData.userId;
    context.log('Api url to get user info: ', usersApiUrl);
    let user;
    try {
        // Get user info
        const response = await axios({
            url: usersApiUrl,
            method: "get"
        });
        // context.log('>>>', response.data);
        if (response && response.data) {
            user = response.data;
        }
    } catch(err) {
        context.log(`Error retrieving user info ${err}`);
        return;
    }

    try {
        context.log(`User ${user.firstName} ${user.lastName} found. start getting the pdf file from local folder`);
        // Local folder where ./reports/expense-{expId}-{timestamp}.pdf has been stored
        const fileName = queueData.fileName;
        const localFilePath = `${settings.Blob.LocalReportFolder}${fileName}`;
        context.log(`Local folder path: ${localFilePath}`);
        let buff = fs.readFileSync(localFilePath);
        let base64data = buff.toString('base64');

        context.bindings.message = {
            "personalizations": [ { "to": [ { "email": user.email } ] } ],
            subject: util.format('Expense has been submitted. RefId: (#%d)', expenseId),
            content: [{
                type: 'text/plain',
                value: util.format("%s %s, your expense, RefId (%d) is being processed. Attached please find a copy of your submission.", user.firstName, user.lastName, expenseId)
            }],
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

        context.log(`Email sent to ${user.email} with ${fileName}`);
        // Send data to queue so file can be removed from local
        context.bindings.outputQueuePdfEmailedToUser = queueData;

    } catch(err) {
        context.log(`Error sending expense email ${err}`);
    }
}
