const settings = require('../local.settings.json');
const azBlobMgr = require('../utils/azureBlobManager');

module.exports = async function (context, queueData) {
    if (!queueData.expenseId || !queueData.userId || !queueData.fileName) {
      context.log('User id, Expense id and fileName are required');
      return
    };
    context.log('JS queue triggered by inputQueuePdfUploadedToStorage', queueData.fileName);
    // Where the expense-1-8989.pdf file is saved currently. Under /reports/expense-1-8989.pdf
    const localFilePath = `${settings.Blob.LocalReportFolder}${queueData.fileName}`;
    context.log(`Local folder path: ${localFilePath}`);
    try {
        const removeResponse = await azBlobMgr.removeLocalFile(context, localFilePath);
        context.log(`Response from removing file: ${removeResponse}`);
    }catch(err) {
      context.log(`Error removing file from local folder: ${err}`)
    };
};
