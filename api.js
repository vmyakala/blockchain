const Blockchain = require('./blockchain');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bitcoin = new Blockchain();
const uuid = require("uuid/v1");
const nodeAddress = uuid().split('-').join('');
const port = process.argv[2];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


app.get('/blockchain', function(req, res){
	res.send(bitcoin);
	console.log(nodeAddress);
});

app.post('/transactions', function(req, res){
	
	const index = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.receiver);
	res.json({note: index});
});


app.get('/mine', function(req, res){
	
	const currentBlockData = bitcoin.getLastBlock();
	//res.send(currentBlockData);
	const previousBlockHash = currentBlockData.currentHash;
	//res.send(previousBlockHash);
	
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const currentHash = bitcoin.createHash(nonce, previousBlockHash, currentBlockData);
	//res.send(nonce);
	bitcoin.createNewTransaction(12.5, '00', nodeAddress);
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, currentHash);
	res.send(newBlock);

});

app.listen(port, function()
	{
		console.log("listening on port"+ port);
	});