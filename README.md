# expensejs-fn

## Azure function app with Node JS/Javascript for expense app. When a user submits expense, below functions (serverless) should run in squence.

### Function: onExpenseSubmittedAddToQueue
#### [INPUT] HTTP Trigger by web app, to notify an expense has been submitted.
#### [OUTPUT] Queue: [expense-data], Name: outputQueueExpenseReceived
#### What it does: Writes the incoming data queue, so it can be processed. { "userId": "user1", "expenseId": 1 }
#### To test from PShell.
`iwr -Method POST `
-Uri https://mn-expen..-js-fnapp.azu..ewebs..es.net/ap./onExp...Subm....ToQue..?code=<<...get from azure...>>`
-Headers @{ "content-type"="application/json" } `
-Body '{ "userId": "user1", "expenseId": "1" }'`


### Function: onExpenseReceivedInQueueCreatePdf
#### [INPUT] Queue Trigger by queue [expense-data]
#### [OUTPUT] Queue: [pdf-created-in-local], Name: outputQueuePdfCreatedInLocal
#### What it does: Calls REST api to get expense items, submitted user info using Axios. Creates a PDF file based on the expense items retrieved and saves it to local folder (/reports). Then writes to queue  with PDF file name.

### Function: onPdfCreatedInLocalFolderUploadToStorage
#### [INPUT] Queue Trigger by [pdf-created-in-local]
#### [OUTPUT] Queue: [pdf-uploaded-to-storage], Name: outputQueuePdfUploadedToStorage
#### What it does: Uploads the PDF file from local folder to Azure Blob storage. Container: [expenses-report]

### Function: onPdfUploadedToStorageSendEmail
#### [INPUT]: Queue trigger by [pdf-uploaded-to-storage]
#### [OUTPUT]: Send Email via SendGrid service.
#### [OUTPUT]: Queue: [pdf-emailed-to-user], Name: outputQueuePdfEmailedToUser
#### What it does: Calls REST api to get user info and email address and send an email to user with PDF attachment. PDF attachment is read from local folder. NOTE: Reading directly from blob is NOT supported, atleast for node js app.

### Function: onPdfUploadedToStorageRemoveLocalFile
#### [INPUT]: Queue trigger by [pdf-emailed-to-user]
#### [OUTPUT]: None
#### What it does: Removes the file from local folder
