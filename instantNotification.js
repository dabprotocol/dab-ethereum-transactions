const Web3 = require('web3');
const MongoClient = require('mongodb').MongoClient;

const config = require('./config/config.json');
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.ethereumWS));

web3.eth.subscribe('pendingTransactions', function(error, result){
    if (!error) {
        console.log("T:");
        console.log(result);
    }
})
    .on("data", function(trxData){
        console.log("T:");
        console.log(trxData);
    });

web3.eth.subscribe('newBlockHeaders', function(error, result){
    console.log(result.number);
})
    .on("data", function(result){
        console.log(result.number);
    });