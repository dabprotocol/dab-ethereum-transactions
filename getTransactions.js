const Web3 = require('web3');
const MongoClient = require('mongodb').MongoClient;

const config = require('./config/config.json');
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethereumRPC));

MongoClient.connect(config.mongodbConnectionString, function(err, client) {
    let db = client.db(config.dbName);

    let findTransactions = () => {
        db.collection('blocks').findOne({status: null}, (error, result) => {
            if (result.transactions.length === 0) {
                db.collection('blocks').updateOne(
                    {blockHeight: result.blockHeight},
                    {$set: {status: 'processed'}},
                    {upsert: true}, () => {
                        findTransactions();
                    });
            } else {
                async.each(result.transactions, (tx, cb) => {
                    web3.eth.getTransaction(tx, (error, result) => {
                        db.collection('transactions').insertOne(result, () => {
                            console.log(result);

                            // throw this into elastic search
                            //cb();
                        });
                    });
                }, () => {
                    db.collection('blocks').updateOne(
                        {blockHeight: result.blockHeight},
                        {$set: {status: 'processed'}},
                        {upsert: true}, () => {
                            findTransactions();
                        });
                });
            }
        });
    };

    findTransactions();

});