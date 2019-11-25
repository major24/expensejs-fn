const azBlobMgr = require('./utils/azureBlobManager');

console.log('>>', azBlobMgr);

const containerName = "expense-data";
const localFilePath = "./reports/expense-1-1574286354585.pdf";

azBlobMgr.uploadLocalFileToBlob(containerName, localFilePath)
  .then(() => {
    console.log('File uploaded');
    azBlobMgr.removeLocalFile(localFilePath);
  }).catch(e => {
    console.log(`Error uploding to Azure blob storage. ${e}`)
  });

console.log('done..');
