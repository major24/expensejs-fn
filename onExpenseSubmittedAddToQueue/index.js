module.exports = async function (context, req) {
    context.log('JS HTTP trigger function processed for expense submitted');

    if (req.body && req.body.userId && req.body.expenseId) {
        const data = { userId: req.body.userId, expenseId: req.body.expenseId };
        context.log(`Data retrieved from request body: ${JSON.stringify(data)}`);
        // Add messages to the Storage queue
        context.bindings.outputQueueExpenseReceived = data;
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: `Expense Id ${req.body.expenseId}, successfully added in Azure Queue for ${req.body.userId}`
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a userid and expense id in the body"
        };
    }
};
