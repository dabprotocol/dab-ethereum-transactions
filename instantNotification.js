const Web3 = require('web3');
const config = require('./config/config.json');

const websocketConnection = new Web3(new Web3.providers.WebsocketProvider(config.ethereumWS));
const web3 = new Web3(new Web3.providers.HttpProvider(config.ethereumRPC));

websocketConnection.eth
    .subscribe('pendingTransactions', function(error, result){})
    .on("data", function(tx){
        let transaction = web3.eth.getTransaction(tx);
        transaction.then(result => {
            if (result && result.from && result.to) {
                console.log("----");
                console.log("Tx Id: " + tx);
                let to = result.to;

                if (result.input === '0x') {
                    console.log("TransferType: ", "Direct Transfer ETH");
                } else {
                    console.log("TransferType: ", "Contract Transfer");
                    to = 'CONTRACT';
                }

                console.log("From: " + result.from);
                console.log("To: " + to);


                console.log("----");
            }
        });
    });