const settings = require('../local.settings.json');
const azBlobMgr = require('../utils/azureBlobManager');

module.exports = async function (context, queueData) {
    if (!queueData.expenseId || !queueData.userId || !queueData.fileName) {
      context.log('User id, Expense id and fileName are required');
      return
    };
    const fileName = queueData.fileName;
    context.log('JS queue triggered onPdfCreatedInLocalFolderUploadToStorage: ', fileName);
    // Blob storage where expense-{expId}-{timestamp}.pdf to be saved
    const containerName = settings.Blob.ContainerName;
    // Where the expense-1-8989.pdf file is saved currently. Under /reports/expense-1-8989.pdf
    const localFilePath = `${settings.Blob.LocalReportFolder}${fileName}`;
    context.log(`Local folder path: ${localFilePath}`);
    try {
        const uploadResponse = await azBlobMgr.uploadLocalFileToBlob(context, containerName, localFilePath);
        context.log(`File ${fileName} has been uploaded to blob storage`);
        // send all queue data to next queue
        context.bindings.outputQueuePdfUploadedToStorage = queueData;
    }catch(err) {
      context.log(`Error uploding to Azure blob storage. ${err}`)
    };
};
