const Web3 = require('web3');
const config = require('./config/config.json');

const websocketConnection = new Web3(new Web3.providers.WebsocketProvider(config.ethereumWS));
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethereumRPC));

websocketConnection.eth
    .subscribe('pendingTransactions', function(error, result){})
    .on("data", function(tx){
        web3.eth.getTransaction(tx, (error, result) => {
            if (result.from && result.to) {
                console.log("----");
                console.log("Tx Id: " + tx);
                console.log("From: " + result.from);
                console.log("To: " + result.to);
                console.log("----");
            }
        });
    });