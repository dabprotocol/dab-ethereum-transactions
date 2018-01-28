const Web3 = require('web3');
const MongoClient = require('mongodb').MongoClient;

const config = require('./config/config.json');
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethereumRPC));

MongoClient.connect(config.mongodbConnectionString, function(err, client) {
    let db = client.db(config.dbName);

    setInterval(() => {
        web3.eth.isSyncing(function (error, sync) {
            if (!error) {
                if (sync === true) {
                    web3.reset(true);
                } else if (sync) {
                    console.log('.');
                    let currentBlockHeight = sync.currentBlock;
                    db.collection('info').updateOne(
                        {type: 'blockInfo'},
                        {$set: {currentBlockHeight: currentBlockHeight}},
                        {upsert: true}
                    );

                } else {
                    //finished sync
                    console.log('finished sync');
                }
            } else {
                console.log(error);
            }
        });
    }, 1000);
});
