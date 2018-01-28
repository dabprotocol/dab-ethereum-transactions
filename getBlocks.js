let Web3 = require('web3');
let MongoClient = require('mongodb').MongoClient;

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let url = 'mongodb://localhost:27017';
let dbName = 'dab_ethereum';

let config = require('./config/config');

console.log(config);
