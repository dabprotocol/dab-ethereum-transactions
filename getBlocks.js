const Web3 = require('web3');
const MongoClient = require('mongodb').MongoClient;

const config = require('./config/config.json');
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethereumRPC));

MongoClient.connect(config.mongodbConnectionString, function(err, client) {
    let db = client.db(config.dbName);

    db.collection('info').findOne({type: 'blockInfo'}, (error, result) => {

        let currentBlockHeight = result.currentBlockHeight;
        let currentProcessedBlockHeight = result.currentProcessedBlockHeight || 1;

        let loop = (current, max) => {
            if (current === max + 1) {
                return ;
            }
            web3.eth.getBlock(currentProcessedBlockHeight, (error, result) => {

                db.collection('blocks').updateOne(
                    {blockHeight: current},
                    {$set : result},
                    {upsert: true}, () => {
                        console.log('.');

                        db.collection('info').updateOne(
                            {type: 'blockInfo'},
                            {$set : {currentProcessedBlockHeight: current}},
                            {upsert: true}, () => {
                                return loop(current + 1, max);
                            });
                    });


            });
        };
        loop(currentProcessedBlockHeight, currentBlockHeight);
    });

});